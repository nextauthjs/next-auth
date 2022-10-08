import logger, { setLogger } from "../utils/logger"
import * as routes from "./routes"
import renderPage from "./pages"
import { init } from "./init"
import { assertConfig } from "./lib/assert"
import { SessionStore } from "./lib/cookie"
import { toInternalRequest, toResponse } from "./lib/spec"

import type { NextAuthAction, NextAuthOptions } from "./types"
import type { Cookie } from "./lib/cookie"
import type { ErrorType } from "./pages/error"

export interface InternalRequest {
  /** @default "http://localhost:3000" */
  host?: string
  method?: string
  cookies?: Partial<Record<string, string>>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  action: NextAuthAction
  providerId?: string
  error?: string
}

export interface InternalResponse<
  Body extends string | Record<string, any> | any[] = any
> {
  status?: number
  headers?: NextAuthHeader[]
  body?: Body
  redirect?: URL | string // TODO: refactor to only allow URL
  cookies?: Cookie[]
}

export interface NextAuthHeader {
  key: string
  value: string
}

async function AuthHandlerInternal<
  Body extends string | Record<string, any> | any[]
>(params: {
  req: InternalRequest
  options: NextAuthOptions
  /** REVIEW: Is this the best way to skip parsing the body in Node.js? */
  parsedBody?: any
}): Promise<InternalResponse<Body>> {
  const { options: userOptions, req } = params
  setLogger(userOptions.logger, userOptions.debug)

  const assertionResult = assertConfig({ options: userOptions, req })

  if (Array.isArray(assertionResult)) {
    assertionResult.forEach(logger.warn)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    logger.error(assertionResult.code, assertionResult)

    const htmlPages = ["signin", "signout", "error", "verify-request"]
    if (!htmlPages.includes(req.action) || req.method !== "GET") {
      const message = `There is a problem with the server configuration. Check the server logs for more information.`
      return {
        status: 500,
        headers: [{ key: "Content-Type", value: "application/json" }],
        body: { message } as any,
      }
    }

    // We can throw in development to surface the issue in the browser too.
    if (process.env.NODE_ENV === "development") throw assertionResult

    const { pages, theme } = userOptions

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

  const { action, providerId, error, method = "GET" } = req

  const { options, cookies } = await init({
    userOptions,
    action,
    providerId,
    host: req.host,
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
          headers: [{ key: "Content-Type", value: "application/json" }],
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
        if (userOptions.logger) {
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
 * The core functionality of `next-auth`.
 * It receives a standard [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)
 * and returns a standard [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).
 */
export async function AuthHandler(
  request: Request,
  options: NextAuthOptions
): Promise<Response> {
  const req = await toInternalRequest(request)
  const internalResponse = await AuthHandlerInternal({ req, options })
  return toResponse(internalResponse)
}
