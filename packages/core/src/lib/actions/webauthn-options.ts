import type { Awaited, InternalOptions, RequestInternal, ResponseInternal } from "../../types.js"
import type { Cookie, SessionStore } from "../utils/cookie.js"
import type { GetUserInfo } from "../../providers/webauthn.js"
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
  let getUserInfoResponse: Awaited<ReturnType<GetUserInfo>> | null = null
  try {
    getUserInfoResponse = await provider.getUserInfo(options, request, sessionUser)
  } catch (e) { }

  // Make a decision on what kind of webauthn options to return
  const decision = decideWebAuthnOptions(action ?? null, sessionUser, getUserInfoResponse)

  switch (decision) {
    case "authenticate":
      return getAuthenticationResponse(narrowOptions, getUserInfoResponse?.userInfo, cookies)
    case "register":
      return getRegistrationResponse(narrowOptions, getUserInfoResponse!.userInfo, cookies)
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
