// @ts-check
import { randomBytes } from "crypto"
import { hashToken } from "../utils"

/**
 * @typedef {import("src/providers").EmailConfig} EmailConfig
 */

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 * @param {string} identifier
 * @param {import("src/types/internals").InternalOptions<EmailConfig & import("src/types/internals").InternalProvider>} options
 */
export default async function email(identifier, options) {
  const { baseUrl, basePath, adapter, provider, logger, callbackUrl } = options

  // Generate token
  const token =
    (await provider.generateVerificationToken?.()) ??
    randomBytes(32).toString("hex")

  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (provider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000
  )

  // Save in database
  // @ts-expect-error
  await adapter.createVerificationToken({
    identifier,
    token: hashToken(token, options),
    expires,
  })

  // Generate a link with email, unhashed token and callback url
  const params = new URLSearchParams({ callbackUrl, token, email: identifier })
  const url = `${baseUrl}${basePath}/callback/${provider.id}?${params}`

  try {
    // Send to user
    await provider.sendVerificationRequest({
      identifier,
      token,
      expires,
      url,
      provider,
    })
  } catch (error) {
    logger.error("SEND_VERIFICATION_EMAIL_ERROR", {
      identifier,
      url,
      error,
    })
    throw new Error("SEND_VERIFICATION_EMAIL_ERROR")
  }
}
