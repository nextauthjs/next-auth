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
  userConfig: AuthConfig
): Promise<ResponseInternal> {
  const { action, providerId, error, method } = request

  const csrfDisabled = userConfig.skipCSRFCheck === skipCSRFCheck

  const config = await init({
    config: userConfig,
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
    const render = renderPage(config)
    switch (action) {
      case "callback":
        return await actions.callback(request, config)
      case "csrf":
        return render.csrf(csrfDisabled)
      case "error":
        return render.error(error)
      case "providers":
        return render.providers()
      case "session":
        return await actions.session(config)
      case "signin":
        return render.signin(request)
      case "signout":
        return render.signout()
      case "verify-request":
        return render.verifyRequest()
      case "webauthn-options":
        return await actions.webAuthnOptions(request, config)
      default:
    }
  } else {
    const { csrfTokenVerified } = config
    switch (action) {
      case "callback":
        if (config.provider.type === "credentials")
          // Verified CSRF Token required for credentials providers only
          validateCSRF(action, csrfTokenVerified)
        return await actions.callback(request, config)
      case "session":
        validateCSRF(action, csrfTokenVerified)
        return await actions.session(config, true, request.body?.data)
      case "signin":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signIn(request, config)
      case "signout":
        validateCSRF(action, csrfTokenVerified)
        return await actions.signOut(config)
      default:
    }
  }
  throw new UnknownAction(`Cannot handle action: ${action}`)
}
