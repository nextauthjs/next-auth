import { createHash, randomString, toRequest } from "../web.js"

import type { InternalOptions, RequestInternal } from "../../types.js"
/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 */
export default async function generateOTP(
  identifier: string,
  options: InternalOptions<"otp">,
  request: RequestInternal
): Promise<string> {
  const { url, adapter, provider, callbackUrl, theme } = options
  // OTP TODO: improve token generation
  const token = '123456'
    // (await provider.generateVerificationToken?.()) ?? randomString(6)

  const ONE_DAY_IN_SECONDS = 86400
  const expires = new Date(
    Date.now() + (provider.maxAge ?? ONE_DAY_IN_SECONDS) * 1000
  )

  // Generate a link with email, unhashed token and callback url
  const params = new URLSearchParams({ callbackUrl, token, email: identifier })
  const _url = `${url}/callback/${provider.id}?${params}`

  const secret = provider.secret ?? options.secret
  await Promise.all([
    provider.sendVerificationRequest({
      identifier,
      token,
      expires,
      url: _url,
      provider,
      theme,
      request: toRequest(request),
    }),
    // @ts-expect-error -- Verified in `assertConfig`.
    adapter.createVerificationToken?.({
      identifier,
      token: await createHash(`${token}${secret}`),
      expires,
    }),
  ])

  return `${url}/verify-otp?${new URLSearchParams({
    provider: provider.id,
    type: provider.type,
    identifier,
    verifyUrl: _url
  })}`
}
