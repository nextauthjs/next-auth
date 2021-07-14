// @ts-check
import { createHash, randomBytes } from "crypto"

/**
 * @typedef {import("types/providers").EmailConfig} EmailConfig
 */

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 * @param {string} identifier
 * @param {import("types/internals").InternalOptions<EmailConfig>} options
 */
export default async function email(identifier, options) {
  const { baseUrl, basePath, adapter, provider } = options

  // Generate token
  const token =
    (await provider.generateVerificationToken?.()) ??
    randomBytes(32).toString("hex")

  // Generate a link with email and the unhashed token
  const params = new URLSearchParams({ token, email: identifier })
  const url = `${baseUrl}${basePath}/callback/${provider.id}?${params}`

  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (provider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000
  )

  // Save in database
  // @ts-expect-error
  await adapter.createVerificationToken({
    identifier,
    url,
    expires,
    token: hashToken(token, options),
  })

  // Send to user
  await provider.sendVerificationRequest({
    identifier,
    url,
    expires,
    provider,
    token,
  })
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
