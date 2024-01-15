import { UnknownAction } from "../errors.js"
import { SessionStore } from "./utils/cookie.js"
import { init } from "./init.js"
import renderPage from "./pages/index.js"
import * as actions from "./actions/index.js"
import { validateCSRF } from "./actions/callback/oauth/csrf-token.js"

import type { AuthConfig, RequestInternal, ResponseInternal } from "../types.js"

/** @internal */
export async function AuthInternal(
  request: RequestInternal,
  authOptions: AuthConfig
): Promise<ResponseInternal> {
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
    request.cookies,
    options.logger
  )

  if (method === "GET") {
    const render = renderPage({ ...options, query: request.query, cookies })
    switch (action) {
      case "callback":
        return await actions.callback(request, options, sessionStore, cookies)
      case "csrf":
        return render.csrf(csrfDisabled, options, cookies)
      case "error":
        return render.error(error)
      case "providers":
        return render.providers(options.providers)
      case "session":
        return await actions.session(options, sessionStore, cookies)
      case "signin":
        return render.signin(error)
      case "signout":
        return render.signout()
      case "verify-request":
        return render.verifyRequest()
      default:
    }
  } else {
    const { csrfTokenVerified } = options
    switch (action) {
      case "callback":
        if (options.provider.type === "credentials")
          // Verified CSRF Token required for credentials providers only
          validateCSRF(action, csrfTokenVerified)
        return await actions.callback(request, options, sessionStore, cookies)
      case "session":
        validateCSRF(action, csrfTokenVerified)
        return await actions.session(
          options,
          sessionStore,
          cookies,
          true,
          request.body?.data
        )
      case "signin":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signIn(request, cookies, options)

      case "signout":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signOut(cookies, sessionStore, options)
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

/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js returns a web standard {@link Response} by default, but
 * if you are implementing a framework you might want to get access to the raw internal response
 * by passing this value to {@link AuthConfig.raw}.
 */
export const raw = Symbol("return-type-raw")
