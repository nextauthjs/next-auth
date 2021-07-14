import { createHash } from "crypto"

/** Takes a number in seconds and returns the date in the future */
export function fromNow(time) {
  return new Date(Date.now() + time * 1000)
}

/**
 * @param {string} token
 * @param {import("types/internals").InternalOptions<EmailConfig>} options
 */
export function hashToken(token, options) {
  const { provider, secret } = options
  return (
    createHash("sha256")
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${provider.secret ?? secret}`)
      .digest("hex")
  )
}
