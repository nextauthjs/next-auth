import { createHash } from "crypto"
import { InternalOptions } from "src/lib/types"

/** Returns state if provider supports it */
export function createState(options: InternalOptions<"oauth">) {
  const { csrfToken, logger, provider } = options

  if (!provider.checks?.includes("state")) {
    // Provider does not support state, return nothing
    return
  }

  if (!csrfToken) {
    logger.warn("NO_CSRF_TOKEN")
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
 */
export function getState({ provider, csrfToken }: InternalOptions<"oauth">) {
  if (provider?.checks?.includes("state") && csrfToken) {
    return createHash("sha256").update(csrfToken).digest("hex")
  }
}
