import logger, { setLogger } from "../utils/logger"
import * as routes from "./routes"
import renderPage from "./pages"
import { init } from "./init"
import { assertConfig as assert } from "./lib/assert"
import { SessionStore } from "./lib/cookie"
import { fromRequest, toResponse } from "./lib/spec"

import type { NextAuthAction, NextAuthOptions } from "./types"
import type { Cookie } from "./lib/cookie"
import type { ErrorType } from "./pages/error"

export interface RequestInternal {
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

export interface NextAuthHeader {
  key: string
  value: string
}

export interface OutgoingResponse<
  Body extends string | Record<string, any> | any[] = any
> {
  status?: number
  headers?: NextAuthHeader[]
  body?: Body
  redirect?: string
  cookies?: Cookie[]
}

export interface NextAuthHandlerParams {
  req: Request
  options: NextAuthOptions
}

async function NextAuthHandlerInternal<
  Body extends string | Record<string, any> | any[]
>(
  request: Request,
  userOptions: NextAuthOptions
): Promise<OutgoingResponse<Body>> {
  const internalRequest = await fromRequest(request)

  const {
    action,
    providerId,
    error,
    method = "GET",
    body,
    query,
    host,
    headers,
  } = internalRequest

  const { options, cookies } = await init({
    userOptions,
    action,
    providerId,
    host: host,
    callbackUrl: body?.callbackUrl ?? query?.callbackUrl,
    csrfToken: body?.csrfToken,
    cookies: internalRequest.cookies,
    isPost: method === "POST",
  })

  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    internalRequest,
    options.logger
  )

  if (method === "GET") {
    const render = renderPage({ ...options, query, cookies })
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
            body,
            query,
            headers,
            cookies: internalRequest.cookies,
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
          const signin = await routes.signin({ query, body, options })
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
            body,
            query,
            headers,
            cookies: internalRequest.cookies,
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
            const { code, level, ...metadata } = body ?? {}
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
export async function NextAuthHandler(
  req: Request,
  options: NextAuthHandlerParams["options"]
): Promise<Response> {
  setLogger(options.logger, options.debug)
  const assertionResult = assert({ req, options })

  if (typeof assertionResult === "string") {
    logger.warn(assertionResult)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    const { pages, theme } = options
    logger.error(assertionResult.code, assertionResult)
    if (pages?.error) {
      return new Response(null, {
        status: 302,
        headers: { Location: `${pages.error}?error=Configuration` },
      })
    }
    const render = renderPage({ theme })
    return toResponse(render.error({ error: "configuration" }))
  }

  return toResponse(await NextAuthHandlerInternal(req, options))
}
