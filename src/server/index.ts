import logger, { setLogger } from "../lib/logger"
import * as routes from "./routes"
import renderPage from "./pages"
import type { NextAuthOptions } from "./types"
import { init } from "./init"
import { Cookie } from "./lib/cookie"

import NextAuth from "../next"

export interface IncomingRequest {
  method?: string
  headers: Record<string, any>
  cookies: Record<string, any>
  query: Record<string, any>
  body: Record<string, any>
}

export interface OutgoingResponse {
  status?: number
  headers?: any[]
  json?: any
  text?: any
  redirect?: string
  cookies?: Cookie[]
}

export async function NextAuthHandler(
  params: IncomingRequest & {
    userOptions: NextAuthOptions
  }
): Promise<OutgoingResponse> {
  const { userOptions, ...req } = params

  if (userOptions.logger) {
    setLogger(userOptions.logger)
  }

  // To work properly in production with OAuth providers the NEXTAUTH_URL
  // environment variable must be set.
  if (!process.env.NEXTAUTH_URL) {
    logger.warn("NEXTAUTH_URL")
  }

  if (!req.query.nextauth) {
    const message =
      "Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly."

    logger.error("MISSING_NEXTAUTH_API_ROUTE_ERROR", new Error(message))
    return {
      status: 500,
      text: `Error: ${message}`,
    }
  }

  const {
    nextauth,
    action = nextauth[0],
    providerId = nextauth[1],
    error = nextauth[1],
  } = req.query

  delete req.query.nextauth

  const { options, cookies } = await init({
    userOptions,
    action,
    providerId,
    callbackUrl: req.body.callbackUrl ?? req.query.callbackUrl,
    csrfToken: req.body.csrfToken,
    cookies: req.cookies,
    isPost: req.method === "POST",
  })

  const render = renderPage({ options, query: req.query, cookies })

  const { pages } = options

  if (req.method === "GET") {
    switch (action) {
      case "providers":
        return { json: routes.providers(options.providers), cookies }
      case "session": {
        const session = await routes.session({
          options,
          sessionToken: req.cookies[options.cookies.sessionToken.name],
        })
        if (session.cookie) {
          cookies.push(session.cookie)
        }
        return { json: session.json, cookies }
      }
      case "csrf":
        return { json: { csrfToken: options.csrfToken }, cookies }
      case "signin":
        if (pages.signIn) {
          let signinUrl = `${pages.signIn}${
            pages.signIn.includes("?") ? "&" : "?"
          }callbackUrl=${options.callbackUrl}`
          if (error) {
            signinUrl = `${signinUrl}&error=${error}`
          }
          return { redirect: signinUrl, cookies }
        }

        return render.signin()
      case "signout":
        if (pages.signOut) return { redirect: pages.signOut, cookies }

        return render.signout()
      case "callback":
        if (options.provider) {
          return await routes.callback(req, res)
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
          return { redirect: `${options.base}/signin?error=${error}`, cookies }
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
          if (signin.cookies) {
            cookies.push(...signin.cookies)
          }
          return { ...signin, cookies }
        }

        return { redirect: `${options.base}/signin?csrf=true`, cookies }
      case "signout":
        // Verified CSRF Token required for signout
        if (options.csrfTokenVerified) {
          const signout = await routes.signout({
            options,
            sessionToken: params.cookies[options.cookies.sessionToken.name],
          })
          if (signout.cookie) {
            cookies.push(signout.cookie)
          }
          return { ...signout, cookies }
        }
        return { redirect: `${options.base}/signout?csrf=true`, cookies }
      case "callback":
        if (options.provider) {
          // Verified CSRF Token required for credentials providers only
          if (
            options.provider.type === "credentials" &&
            !options.csrfTokenVerified
          ) {
            return { redirect: `${options.base}/signin?csrf=true`, cookies }
          }

          return await routes.callback(req, res)
        }
        break
      case "_log":
        if (userOptions.logger) {
          try {
            const { code, level, ...metadata } = req.body
            logger[level](code, metadata)
          } catch (error) {
            // If logging itself failed...
            logger.error("LOGGER_ERROR", error)
          }
        }
        return { cookies }
      default:
    }
  }
  return { status: 400, cookies: [] }
}

export default NextAuth
