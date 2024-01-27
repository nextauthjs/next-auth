import type { InternalOptions, RequestInternal, ResponseInternal } from "../../types.js"
import type { Cookie, SessionStore } from "../utils/cookie.js"
import { getLoggedInUser } from "../utils/session.js"
import { assertInternalOptionsWebAuthn, decideWebAuthnOptions, getAuthenticationResponse, getRegistrationResponse } from "../utils/webauthn-utils.js"

/**
 * Returns authentication or registration options for a WebAuthn flow
 * depending on the parameters provided.
 */
export async function webAuthnOptions(
  request: RequestInternal,
  options: InternalOptions,
  sessionStore: SessionStore,
  cookies: Cookie[]
): Promise<ResponseInternal> {
  // Return an error if the adapter is missing or if the provider
  // is not a webauthn provider.
  const narrowOptions = assertInternalOptionsWebAuthn(options)
  const { provider } = narrowOptions

  // Extract the action from the query parameters
  const { action } = (request.query ?? {}) as Record<string, unknown>

  // Action must be either "register", "authenticate", or undefined
  if (action !== "register" && action !== "authenticate" && typeof action !== "undefined") {
    return {
      status: 400,
      body: { error: "Invalid action" },
      cookies,
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  // Get the user info, if any
  const sessionUser = await getLoggedInUser(options, sessionStore)

  // Extract user info from request
  // If session user exists, we don't need to call getUserInfo
  const getUserInfoResponse = sessionUser ? {
    user: sessionUser,
    exists: true
  } : await provider.getUserInfo(options, request)

  // Make a decision on what kind of webauthn options to return
  const decision = decideWebAuthnOptions(action, !!sessionUser, getUserInfoResponse)

  switch (decision) {
    case "authenticate":
      return getAuthenticationResponse(narrowOptions, getUserInfoResponse?.user, cookies)
    case "register":
      return getRegistrationResponse(narrowOptions, getUserInfoResponse!.user, cookies)
    default:
      return {
        status: 400,
        body: { error: "Invalid request" },
        cookies,
        headers: {
          "Content-Type": "application/json"
        }
      }
  }
}
