import { createHash } from "crypto"

/**
 * Returns state if provider supports it
 * @param {import("src/lib/types").NextAuthRequest} req
 * @param {import("src/lib/types").NextAuthResponse} res
 */
export function createState(req) {
  const { csrfToken, logger } = req.options
  /** @type {import("src/providers").OAuthConfig} */
  const provider = req.options.provider
  if (!provider.checks?.includes("state")) {
    // Provider does not support state, return nothing
    return
  }

  // A hash of the NextAuth.js CSRF token is used as the state
  const state = createHash("sha256").update(csrfToken).digest("hex")

  logger.debug("OAUTH_CALLBACK_PROTECTION", { state, csrfToken })
  return state
}

/**
 * Consistently recreate state from the csrfToken
 * if `provider.checks` supports `"state"`.
 * @param {import("src/lib/types").NextAuthRequest} req
 */
export function getState({ options }) {
  /** @type {import("src/providers").OAuthConfig} */
  const provider = options.provider
  if (provider?.checks.includes("state")) {
    return createHash("sha256").update(options.csrfToken).digest("hex")
  }
}
