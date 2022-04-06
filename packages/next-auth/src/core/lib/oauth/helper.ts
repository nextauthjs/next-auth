import { generateRandomCodeVerifier } from "@panva/oauth4webapi"

/**
 * Generate random `state` value encoded as base64url. This method returns oauth4webapi's `generateRandomCodeVerifier` for convenience.
 * @see {@link https://github.com/panva/oauth4webapi/blob/main/docs/functions/generateRandomCodeVerifier.md generateRandomCodeVerifier.}
 */
export function generateRandomState() {
  return generateRandomCodeVerifier()
}
