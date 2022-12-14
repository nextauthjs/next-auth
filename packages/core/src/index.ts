import { init } from "./lib/init.js"
import { assertConfig } from "./lib/assert.js"
import { SessionStore } from "./lib/cookie.js"
import { toInternalRequest, toResponse } from "./lib/web.js"
import renderPage from "./lib/pages/index.js"
import * as routes from "./lib/routes/index.js"
import logger, { setLogger } from "./lib/utils/logger.js"

import type { ErrorType } from "./lib/pages/error.js"
import type {
  AuthOptions,
  RequestInternal,
  ResponseInternal,
} from "./lib/types.js"
import { UntrustedHost } from "./lib/errors.js"

export * from "./lib/types.js"

const configErrorMessage =
  "There is a problem with the server configuration. Check the server logs for more information."

async function AuthHandlerInternal<
  Body extends string | Record<string, any> | any[]
>(params: {
  req: RequestInternal
  options: AuthOptions
  /** REVIEW: Is this the best way to skip parsing the body in Node.js? */
  parsedBody?: any
}): Promise<ResponseInternal<Body>> {
  const { options: authOptions, req } = params

  const assertionResult = assertConfig({ options: authOptions, req })

  if (Array.isArray(assertionResult)) {
    assertionResult.forEach(logger.warn)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    logger.error((assertionResult as any).code, assertionResult)

    const htmlPages = ["signin", "signout", "error", "verify-request"]
    if (!htmlPages.includes(req.action) || req.method !== "GET") {
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: { message: configErrorMessage } as any,
      }
    }
    const { pages, theme } = authOptions

    const authOnErrorPage =
      pages?.error && req.query?.callbackUrl?.startsWith(pages.error)

    if (!pages?.error || authOnErrorPage) {
      if (authOnErrorPage) {
        logger.error(
          "AUTH_ON_ERROR_PAGE_ERROR",
          new Error(
            `The error page ${pages?.error} should not require authentication`
          )
        )
      }
      const render = renderPage({ theme })
      return render.error({ error: "configuration" })
    }

    return {
      redirect: `${pages.error}?error=Configuration`,
    }
  }

  const { action, providerId, error, method } = req

  const { options, cookies } = await init({
    authOptions,
    action,
    providerId,
    url: req.url,
    callbackUrl: req.body?.callbackUrl ?? req.query?.callbackUrl,
    csrfToken: req.body?.csrfToken,
    cookies: req.cookies,
    isPost: method === "POST",
  })

  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    req,
    options.logger
  )

  if (method === "GET") {
    const render = renderPage({ ...options, query: req.query, cookies })
    const { pages } = options
    switch (action) {
      case "providers":
        return (await routes.providers(options.providers)) as any
      case "session": {
        const session = await routes.session({ options, sessionStore })
        if (session.cookies) cookies.push(...session.cookies)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return { ...session, cookies } as any
      }
      case "csrf":
        return {
          headers: { "Content-Type": "application/json" },
          body: { csrfToken: options.csrfToken } as any,
          cookies,
        }
      case "signin":
        if (pages.signIn) {
          let signinUrl = `${pages.signIn}${
            pages.signIn.includes("?") ? "&" : "?"
          }callbackUrl=${encodeURIComponent(options.callbackUrl)}`
          if (error)
            signinUrl = `${signinUrl}&error=${encodeURIComponent(error)}`
          return { redirect: signinUrl, cookies }
        }

        return render.signin()
      case "signout":
        if (pages.signOut) return { redirect: pages.signOut, cookies }

        return render.signout()
      case "callback":
        if (options.provider) {
          const callback = await routes.callback({
            body: req.body,
            query: req.query,
            headers: req.headers,
            cookies: req.cookies,
            method,
            options,
            sessionStore,
          })
          if (callback.cookies) cookies.push(...callback.cookies)
          return { ...callback, cookies }
        }
        break
      case "verify-request":
        if (pages.verifyRequest) {
          return { redirect: pages.verifyRequest, cookies }
        }
        return render.verifyRequest()
      case "error":
        // These error messages are displayed in line on the sign in page
        if (
          [
            "Signin",
            "OAuthSignin",
            "OAuthCallback",
            "OAuthCreateAccount",
            "EmailCreateAccount",
            "Callback",
            "OAuthAccountNotLinked",
            "EmailSignin",
            "CredentialsSignin",
            "SessionRequired",
          ].includes(error as string)
        ) {
          return { redirect: `${options.url}/signin?error=${error}`, cookies }
        }

        if (pages.error) {
          return {
            redirect: `${pages.error}${
              pages.error.includes("?") ? "&" : "?"
            }error=${error}`,
            cookies,
          }
        }

        return render.error({ error: error as ErrorType })
      default:
    }
  } else if (method === "POST") {
    switch (action) {
      case "signin":
        // Verified CSRF Token required for all sign in routes
        if (options.csrfTokenVerified && options.provider) {
          const signin = await routes.signin({
            query: req.query,
            body: req.body,
            options,
          })
          if (signin.cookies) cookies.push(...signin.cookies)
          return { ...signin, cookies }
        }

        return { redirect: `${options.url}/signin?csrf=true`, cookies }
      case "signout":
        // Verified CSRF Token required for signout
        if (options.csrfTokenVerified) {
          const signout = await routes.signout({ options, sessionStore })
          if (signout.cookies) cookies.push(...signout.cookies)
          return { ...signout, cookies }
        }
        return { redirect: `${options.url}/signout?csrf=true`, cookies }
      case "callback":
        if (options.provider) {
          // Verified CSRF Token required for credentials providers only
          if (
            options.provider.type === "credentials" &&
            !options.csrfTokenVerified
          ) {
            return { redirect: `${options.url}/signin?csrf=true`, cookies }
          }

          const callback = await routes.callback({
            body: req.body,
            query: req.query,
            headers: req.headers,
            cookies: req.cookies,
            method,
            options,
            sessionStore,
          })
          if (callback.cookies) cookies.push(...callback.cookies)
          return { ...callback, cookies }
        }
        break
      case "_log":
        if (authOptions.logger) {
          try {
            const { code, level, ...metadata } = req.body ?? {}
            logger[level](code, metadata)
          } catch (error) {
            // If logging itself failed...
            logger.error("LOGGER_ERROR", error as Error)
          }
        }
        return {}
      default:
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by NextAuth.js` as any,
  }
}

/**
 * The core functionality of Auth.js.
 * It receives a standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * and returns a standard [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 */
export async function AuthHandler(
  request: Request,
  options: AuthOptions
): Promise<Response> {
  setLogger(options.logger, options.debug)

  if (!options.trustHost) {
    const error = new UntrustedHost(
      `Host must be trusted. URL was: ${request.url}`
    )
    logger.error(error.code, error)

    return new Response(JSON.stringify({ message: configErrorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  const req = await toInternalRequest(request)
  if (req instanceof Error) {
    logger.error((req as any).code, req)
    return new Response(
      `Error: This action with HTTP ${request.method} is not supported.`,
      { status: 400 }
    )
  }
  const internalResponse = await AuthHandlerInternal({ req, options })

  const response = await toResponse(internalResponse)

  // If the request expects a return URL, send it as JSON
  // instead of doing an actual redirect.
  const redirect = response.headers.get("Location")
  if (request.headers.has("X-Auth-Return-Redirect") && redirect) {
    response.headers.delete("Location")
    response.headers.set("Content-Type", "application/json")
    return new Response(JSON.stringify({ url: redirect }), {
      headers: response.headers,
    })
  }
  return response
}
