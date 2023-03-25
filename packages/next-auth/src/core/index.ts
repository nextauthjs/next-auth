import logger, { setLogger } from "../utils/logger"
import { detectHost } from "../utils/detect-host"
import * as routes from "./routes"
import renderPage from "./pages"
import { init } from "./init"
import { assertConfig } from "./lib/assert"
import { SessionStore } from "./lib/cookie"

import type { AuthAction, AuthOptions } from "./types"
import type { Cookie } from "./lib/cookie"
import type { ErrorType } from "./pages/error"
import { parse as parseCookie } from "cookie"

export interface RequestInternal {
  /** @default "http://localhost:3000" */
  host?: string
  method?: string
  cookies?: Partial<Record<string, string>>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  action: AuthAction
  providerId?: string
  error?: string
}

export interface NextAuthHeader {
  key: string
  value: string
}

export interface ResponseInternal<
  Body extends string | Record<string, any> | any[] = any
> {
  status?: number
  headers?: NextAuthHeader[]
  body?: Body
  redirect?: string
  cookies?: Cookie[]
}

export interface NextAuthHandlerParams {
  req: Request | RequestInternal
  options: AuthOptions
}

async function getBody(req: Request): Promise<Record<string, any> | undefined> {
  try {
    return await req.json()
  } catch {}
}

// TODO:
async function toInternalRequest(
  req: RequestInternal | Request
): Promise<RequestInternal> {
  if (req instanceof Request) {
    const url = new URL(req.url)
    // TODO: handle custom paths?
    const nextauth = url.pathname.split("/").slice(3)
    const headers = Object.fromEntries(req.headers)
    const query: Record<string, any> = Object.fromEntries(url.searchParams)
    query.nextauth = nextauth

    return {
      action: nextauth[0] as AuthAction,
      method: req.method,
      headers,
      body: await getBody(req),
      cookies: parseCookie(req.headers.get("cookie") ?? ""),
      providerId: nextauth[1],
      error: url.searchParams.get("error") ?? nextauth[1],
      host: detectHost(headers["x-forwarded-host"] ?? headers.host),
      query,
    }
  }
  return req
}

export async function AuthHandler<
  Body extends string | Record<string, any> | any[]
>(params: NextAuthHandlerParams): Promise<ResponseInternal<Body>> {
  const { options: authOptions, req: incomingRequest } = params

  const req = await toInternalRequest(incomingRequest)

  setLogger(authOptions.logger, authOptions.debug)

  const assertionResult = assertConfig({ options: authOptions, req })

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

  const { action, providerId, error, method = "GET" } = req

  const { options, cookies } = await init({
    authOptions,
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
        // Verified CSRF Token required for all sign-in routes
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
      case "_log": {
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
      }
      case "session": {
        // Verified CSRF Token required for session updates
        if (options.csrfTokenVerified) {
          const session = await routes.session({
            options,
            sessionStore,
            newSession: req.body?.data,
            isUpdate: true,
          })
          if (session.cookies) cookies.push(...session.cookies)
          return { ...session, cookies } as any
        }

        // If CSRF token is invalid, return a 400 status code
        // we should not redirect to a page as this is an API route
        return { status: 400, body: {} as any, cookies }
      }
      default:
    }
  }

  return {
    status: 400,
    body: `Error: This action with HTTP ${method} is not supported by NextAuth.js` as any,
  }
}
