import { SessionStore } from "./cookie.js"
import { UnknownAction } from "./errors.js"
import { init } from "./init.js"
import renderPage from "./pages/index.js"
import * as routes from "./routes/index.js"

import type { AuthConfig, ErrorPageParam } from "../index.js"
import type { RequestInternal, ResponseInternal } from "./types.js"

export async function AuthInternal<
  Body extends string | Record<string, any> | any[]
>(
  request: RequestInternal,
  authConfig: AuthConfig
): Promise<ResponseInternal<Body>> {
  const { action, providerId, error, method } = request

  const { config, cookies } = await init({
    authConfig,
    action,
    providerId,
    url: request.url,
    callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
    csrfToken: request.body?.csrfToken,
    cookies: request.cookies,
    isPost: method === "POST",
  })

  const sessionStore = new SessionStore(
    config.cookies.sessionToken,
    request,
    config.logger
  )

  if (method === "GET") {
    const render = renderPage({ ...config, query: request.query, cookies })
    const { pages } = config
    switch (action) {
      case "providers":
        return (await routes.providers(config.providers)) as any
      case "session": {
        const session = await routes.session(sessionStore, config)
        if (session.cookies) cookies.push(...session.cookies)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return { ...session, cookies } as any
      }
      case "csrf":
        return {
          headers: { "Content-Type": "application/json" },
          body: { csrfToken: config.csrfToken } as any,
          cookies,
        }
      case "signin":
        if (pages.signIn) {
          let signinUrl = `${pages.signIn}${
            pages.signIn.includes("?") ? "&" : "?"
          }callbackUrl=${encodeURIComponent(config.callbackUrl)}`
          if (error)
            signinUrl = `${signinUrl}&error=${encodeURIComponent(error)}`
          return { redirect: signinUrl, cookies }
        }

        return render.signin()
      case "signout":
        if (pages.signOut) return { redirect: pages.signOut, cookies }

        return render.signout()
      case "callback":
        if (config.provider) {
          const callback = await routes.callback({
            body: request.body,
            query: request.query,
            headers: request.headers,
            cookies: request.cookies,
            method,
            config: config,
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
          return { redirect: `${config.url}/signin?error=${error}`, cookies }
        }

        if (pages.error) {
          return {
            redirect: `${pages.error}${
              pages.error.includes("?") ? "&" : "?"
            }error=${error}`,
            cookies,
          }
        }

        return render.error({ error: error as ErrorPageParam })
      default:
    }
  } else {
    switch (action) {
      case "signin":
        // Verified CSRF Token required for all sign in routes
        if (config.csrfTokenVerified && config.provider) {
          const signin = await routes.signin(
            request.query,
            request.body,
            config
          )
          if (signin.cookies) cookies.push(...signin.cookies)
          return { ...signin, cookies }
        }

        return { redirect: `${config.url}/signin?csrf=true`, cookies }
      case "signout":
        // Verified CSRF Token required for signout
        if (config.csrfTokenVerified) {
          const signout = await routes.signout(sessionStore, config)
          if (signout.cookies) cookies.push(...signout.cookies)
          return { ...signout, cookies }
        }
        return { redirect: `${config.url}/signout?csrf=true`, cookies }
      case "callback":
        if (config.provider) {
          // Verified CSRF Token required for credentials providers only
          if (
            config.provider.type === "credentials" &&
            !config.csrfTokenVerified
          ) {
            return { redirect: `${config.url}/signin?csrf=true`, cookies }
          }

          const callback = await routes.callback({
            body: request.body,
            query: request.query,
            headers: request.headers,
            cookies: request.cookies,
            method,
            config: config,
            sessionStore,
          })
          if (callback.cookies) cookies.push(...callback.cookies)
          return { ...callback, cookies }
        }
        break
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`)
}
