import { UnknownAction } from "../errors.js"
import { init } from "./init.js"
import renderPage from "./pages/index.js"
import * as actions from "./actions/index.js"
import { validateCSRF } from "./actions/callback/oauth/csrf-token.js"

import type { RequestInternal, ResponseInternal } from "../types.js"
import type { AuthConfig } from "../index.js"
import { skipCSRFCheck } from "./symbols.js"

/** @internal */
export async function AuthInternal(
  request: RequestInternal,
  config: AuthConfig
): Promise<ResponseInternal> {
  const { action, providerId, error, method } = request

  const csrfDisabled = config.skipCSRFCheck === skipCSRFCheck

  const internalConfig = await init({
    config,
    action,
    providerId,
    url: request.url,
    callbackUrl: request.body?.callbackUrl ?? request.query?.callbackUrl,
    csrfToken: request.body?.csrfToken,
    cookies: request.cookies,
    isPost: method === "POST",
    csrfDisabled,
  })

  if (method === "GET") {
    const render = renderPage(request, internalConfig)
    switch (action) {
      case "callback":
        return await actions.callback(request, internalConfig)
      case "csrf":
        return render.csrf(csrfDisabled)
      case "error":
        return render.error(error)
      case "providers":
        return render.providers()
      case "session":
        return await actions.session(internalConfig)
      case "signin":
        return render.signin(providerId, error)
      case "signout":
        return render.signout()
      case "verify-request":
        return render.verifyRequest()
      case "webauthn-options":
        return await actions.webAuthnOptions(request, internalConfig)
      default:
    }
  } else {
    const { csrfTokenVerified } = internalConfig
    switch (action) {
      case "callback":
        if (internalConfig.provider.type === "credentials")
          // Verified CSRF Token required for credentials providers only
          validateCSRF(action, csrfTokenVerified)
        return await actions.callback(request, internalConfig)
      case "session":
        validateCSRF(action, csrfTokenVerified)
        return await actions.session(internalConfig, true, request.body?.data)
      case "signin":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signIn(request, internalConfig)
      case "signout":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signOut(internalConfig)
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`)
}
