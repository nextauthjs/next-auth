import { UnknownAction } from "../errors.js"
import { SessionStore } from "./cookie.js"
import { init } from "./init.js"
import renderPage from "./pages/index.js"
import * as routes from "./routes/index.js"

import type {
  AuthConfig,
  ErrorPageParam,
  RequestInternal,
  ResponseInternal,
} from "../types.js"

/** @internal */
export async function AuthInternal<
  Body extends string | Record<string, any> | any[]
>(
  request: RequestInternal,
  authOptions: AuthConfig
): Promise<ResponseInternal<Body>> {
  const { action, providerId, error, method } = request

  const csrfDisabled = authOptions.skipCSRFCheck === skipCSRFCheck

  const { options, cookies } = await init({
    authOptions,
    action,
    providerId,
    url: request.url,
    callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
    csrfToken: request.body?.csrfToken,
    cookies: request.cookies,
    isPost: method === "POST",
    csrfDisabled,
  })

  const sessionStore = new SessionStore(
    options.cookies.sessionToken,
    request,
    options.logger
  )

  if (method === "GET") {
    const render = renderPage({ ...options, query: request.query, cookies })
    const { pages } = options
    switch (action) {
      case "providers":
        return (await routes.providers(options.providers)) as any
      case "session": {
        const session = await routes.session({ sessionStore, options })
        if (session.cookies) cookies.push(...session.cookies)
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        return { ...session, cookies } as any
      }
      case "csrf": {
        if (csrfDisabled) {
          options.logger.warn("csrf-disabled")
          cookies.push({
            name: options.cookies.csrfToken.name,
            value: "",
            options: { ...options.cookies.csrfToken.options, maxAge: 0 },
          })
          return { status: 404, cookies }
        }
        return {
          headers: { "Content-Type": "application/json" },
          body: { csrfToken: options.csrfToken } as any,
          cookies,
        }
      }
      case "signin":
        if (pages.signIn) {
          let signinUrl = `${pages.signIn}${
            pages.signIn.includes("?") ? "&" : "?"
          }${new URLSearchParams({ callbackUrl: options.callbackUrl })}`
          if (error)
            signinUrl = `${signinUrl}&${new URLSearchParams({ error })}`
          return { redirect: signinUrl, cookies }
        }

        return render.signin()
      case "signout":
        if (pages.signOut) return { redirect: pages.signOut, cookies }

        return render.signout()
      case "callback":
        if (options.provider) {
          const callback = await routes.callback({
            body: request.body,
            query: request.query,
            headers: request.headers,
            cookies: request.cookies,
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
        // TODO: verify these. We should redirect these to signin directly, instead of
        // first to error and then to signin.
        if (
          [
            "Signin",
            "OAuthCreateAccount",
            "EmailCreateAccount",
            "Callback",
            "OAuthAccountNotLinked",
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

        return render.error({ error: error as ErrorPageParam })
      default:
    }
  } else {
    switch (action) {
      case "signin":
        if ((csrfDisabled || options.csrfTokenVerified) && options.provider) {
          const signin = await routes.signin(
            request,
            options
          )
          if (signin.cookies) cookies.push(...signin.cookies)
          return { ...signin, cookies }
        }

        return { redirect: `${options.url}/signin?csrf=true`, cookies }
      case "signout":
        if (csrfDisabled || options.csrfTokenVerified) {
          const signout = await routes.signout(sessionStore, options)
          if (signout.cookies) cookies.push(...signout.cookies)
          return { ...signout, cookies }
        }
        return { redirect: `${options.url}/signout?csrf=true`, cookies }
      case "callback":
        if (options.provider) {
          // Verified CSRF Token required for credentials providers only
          if (
            options.provider.type === "credentials" &&
            !csrfDisabled &&
            !options.csrfTokenVerified
          ) {
            return { redirect: `${options.url}/signin?csrf=true`, cookies }
          }

          const callback = await routes.callback({
            body: request.body,
            query: request.query,
            headers: request.headers,
            cookies: request.cookies,
            method,
            options,
            sessionStore,
          })
          if (callback.cookies) cookies.push(...callback.cookies)
          return { ...callback, cookies }
        }
        break
      case "session": {
        if (options.csrfTokenVerified) {
          const session = await routes.session({
            options,
            sessionStore,
            newSession: request.body?.data,
            isUpdate: true,
          })
          if (session.cookies) cookies.push(...session.cookies)
          return { ...session, cookies } as any
        }

        // If CSRF token is invalid, return a 400 status code
        // we should not redirect to a page as this is an API route
        return { status: 400, cookies }
      }
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`)
}

/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js comes with built-in {@link https://authjs.dev/concepts/security#csrf CSRF} protection, but
 * if you are implementing a framework that is already protected against CSRF attacks, you can skip this check by
 * passing this value to {@link AuthConfig.skipCSRFCheck}.
 */
export const skipCSRFCheck = Symbol("skip-csrf-check")
