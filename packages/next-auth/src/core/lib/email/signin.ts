import { randomBytes } from "crypto"
import { hashToken } from "../utils"
import type { InternalOptions } from "../../types"

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 */
export default async function email(
  identifier: string,
  options: InternalOptions<"email">
): Promise<string> {
  const { url, adapter, provider, callbackUrl, theme } = options
  // Generate token
  const token =
    (await provider.generateVerificationToken?.()) ??
    randomBytes(32).toString("hex")

  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (provider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000
  )

  // Generate a link with email, unhashed token and callback url
  const params = new URLSearchParams({ callbackUrl, token, email: identifier })
  const _url = `${url}/callback/${provider.id}?${params}`

  await Promise.all([
    // Send to user
    provider.sendVerificationRequest({
      identifier,
      token,
      expires,
      url: _url,
      provider,
      theme,
    }),
    // Save in database
    adapter.createVerificationToken({
      identifier,
      token: hashToken(token, options),
      expires,
    }),
  ])

  return `${url}/verify-request?${new URLSearchParams({
    provider: provider.id,
    type: provider.type,
  })}`
}
