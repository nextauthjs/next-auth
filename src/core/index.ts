import logger from "../lib/logger"
import * as routes from "./routes"
import renderPage from "./pages"
import type { NextAuthOptions } from "./types"
import { init } from "./init"
import { Cookie } from "./lib/cookie"

import { NextAuthAction } from "../lib/types"

export interface IncomingRequest {
  /** @default "http://localhost:3000" */
  host?: string
  method: string
  cookies?: Record<string, any>
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

interface NextAuthHandlerParams {
  req: IncomingRequest
  options: NextAuthOptions
}

export async function NextAuthHandler<
  Body extends string | Record<string, any> | any[]
>(params: NextAuthHandlerParams): Promise<OutgoingResponse<Body>> {
  const { options: userOptions, req } = params
  const { action, providerId, error } = req

  const { options, cookies } = await init({
    userOptions,
    action,
    providerId,
    host: req.host,
    callbackUrl: req.body?.callbackUrl ?? req.query?.callbackUrl,
    csrfToken: req.body?.csrfToken,
    cookies: req.cookies,
    isPost: req.method === "POST",
  })

  const sessionToken =
    req.cookies?.[options.cookies.sessionToken.name] ||
    req.headers?.Authorization?.replace("Bearer ", "")

  const codeVerifier = req.cookies?.[options.cookies.pkceCodeVerifier.name]

  if (req.method === "GET") {
    const render = renderPage({ options, query: req.query, cookies })
    const { pages } = options
    switch (action) {
      case "providers":
        return (await routes.providers(options.providers)) as any
      case "session":
        return (await routes.session({ options, sessionToken })) as any
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
          }callbackUrl=${options.callbackUrl}`
          if (error) signinUrl = `${signinUrl}&error=${error}`
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
            method: req.method,
            headers: req.headers,
            options,
            sessionToken,
            codeVerifier,
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
        if (pages.error) {
          return {
            redirect: `${pages.error}${
              pages.error.includes("?") ? "&" : "?"
            }error=${error}`,
            cookies,
          }
        }

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

        return render.error({ error })
      default:
    }
  } else if (req.method === "POST") {
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
          const signout = await routes.signout({ options, sessionToken })
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
            method: req.method,
            headers: req.headers,
            options,
            sessionToken,
            codeVerifier,
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
            logger.error("LOGGER_ERROR", error)
          }
        }
        return {}
      default:
    }
  }

  return {
    status: 400,
    body: `Error: Action ${action} with HTTP ${req.method} is not supported by NextAuth.js` as any,
  }
}
