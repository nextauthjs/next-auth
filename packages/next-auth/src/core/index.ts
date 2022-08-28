import logger, { setLogger } from "../utils/logger"
import { detectHost } from "../utils/detect-host"
import * as routes from "./routes"
import renderPage from "./pages"
import { init } from "./init"
import { assertConfig } from "./lib/assert"
import { SessionStore } from "./lib/cookie"

import type { NextAuthAction, NextAuthOptions } from "./types"
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
  req: Request | RequestInternal
  options: NextAuthOptions
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
    const headers = Object.fromEntries(req.headers.entries())
    const query: Record<string, any> = Object.fromEntries(
      url.searchParams.entries()
    )
    query.nextauth = nextauth

    return {
      action: nextauth[0] as NextAuthAction,
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

export async function NextAuthHandler<
  Body extends string | Record<string, any> | any[]
>(params: NextAuthHandlerParams): Promise<OutgoingResponse<Body>> {
  const { options: userOptions, req: incomingRequest } = params

  const req = await toInternalRequest(incomingRequest)

  setLogger(userOptions.logger, userOptions.debug)

  const assertionResult = assertConfig({ options: userOptions, req })

  if (Array.isArray(assertionResult)) {
    assertionResult.forEach(logger.warn)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    const { pages, theme } = userOptions
    logger.error(assertionResult.code, assertionResult)

    const authOnErrorPage =
      pages?.error &&
      req.action === "signin" &&
      req.query?.callbackUrl.startsWith(pages.error)

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
      case "proxy": {
        const cookies: Record<string, string> = {}
        if (req.body?.sessionToken) {
          cookies[options.cookies.sessionToken.name] = req.body.sessionToken
        }
        if (req.body?.csrfToken) {
          cookies[options.cookies.csrfToken.name] = req.body.csrfToken
        }
        if (req.body?.stateEncrypted) {
          cookies[options.cookies.state.name] = req.body.stateEncrypted
        }
        if (req.body?.codeVerifier) {
          cookies[options.cookies.pkceCodeVerifier.name] = req.body.codeVerifier
        }
        switch (req.body?.action) {
          case "signin": {
            // Get csrf token
            const csrfTokenRes = await NextAuthHandler({
              req: {
                action: "csrf",
              },
              options: userOptions,
            })
            const csrfToken = (csrfTokenRes.body as any).csrfToken
            const csrfTokenCookie = csrfTokenRes.cookies?.find(
              (c) => c.name === options.cookies.csrfToken.name
            )?.value
            if (csrfTokenCookie) {
              cookies[options.cookies.csrfToken.name] = csrfTokenCookie
            }

            // Get authorizationUrl
            const callbackUrl = req.body?.callbackUrl
            cookies[options.cookies.callbackUrl.name] = callbackUrl

            const signInRes = await NextAuthHandler({
              req: {
                action: "signin",
                method: "POST",
                cookies,
                body: {
                  csrfToken,
                  callbackUrl,
                },
                providerId: req.body?.providerId,
              },
              options: userOptions,
            })

            const authorizationUrl = signInRes.redirect as string
            const url = new URL(authorizationUrl)
            const params = new URLSearchParams(url.search)

            // state
            const stateEncrypted = signInRes.cookies?.find(
              (c) => c.name === options.cookies.state.name
            )?.value
            const state = params.get("state") as string

            // pkce code verifier
            const codeChallenge = params.get("code_challenge") as string
            const codeVerifier = signInRes.cookies?.find(
              (c) => c.name === options.cookies.pkceCodeVerifier.name
            )?.value

            // also return the provider client_id
            const provider = options.providers.find(
              ({ id }) => id === req.body?.providerId
            )
            let clientId: string | undefined
            if (provider?.type === "oauth") {
              clientId = provider.clientId
            }

            return {
              headers: [{ key: "Content-Type", value: "application/json" }],
              body: {
                state,
                stateEncrypted,
                csrfTokenCookie,
                codeVerifier,
                codeChallenge,
                clientId,
              } as any,
            }
          }
          case "callback": {
            // Callback
            const callbackRes = await NextAuthHandler({
              req: {
                action: "callback",
                cookies,
                providerId: req.body?.providerId,
                query: {
                  state: req.body?.state,
                  code: req.body?.code,
                },
              },
              options: userOptions,
            })
            const location = callbackRes.redirect as string
            const url = new URL(location)
            const params = new URLSearchParams(url.search)
            const error = params.get("error")
            if (error) {
              return { body: { error } as any }
            }
            const sessionToken = callbackRes.cookies?.find(
              (c) => c.name === options.cookies.sessionToken.name
            )?.value
            return { body: { sessionToken } as any }
          }
          case "signout": {
            return {} // TODO:
          }
        }
        return await NextAuthHandler({
          req: {
            cookies,
            action: req.body?.action,
          },
          options: userOptions,
        })
      }
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
