import {
  createHash,
  randomNumber,
  randomString,
  toRequest,
} from "../../utils/web.js"
import { AccessDenied } from "../../../errors.js"

import type { InternalOptions, RequestInternal } from "../../../types.js"
import type { Account } from "../../../types.js"

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter).
 * At the end, it returns a redirect to the `verify-request` page.
 */
export async function sendSmsToken(
  request: RequestInternal,
  options: InternalOptions<"sms">
) {
  const { body } = request
  const { provider, callbacks, adapter } = options
  const normalizer = provider.normalizeIdentifier ?? defaultNormalizer
  const phone_number = normalizer(body?.phone_number)

  const defaultUser = { id: crypto.randomUUID(), phone_number }
  const user =
    (await adapter!.getUserByPhoneNumber(phone_number)) ?? defaultUser

  const account = {
    providerAccountId: phone_number,
    userId: user.id,
    type: "sms",
    provider: provider.id,
  } satisfies Account

  let authorized
  try {
    authorized = await callbacks.signIn({
      user,
      account,
      email: { verificationRequest: true },
    })
  } catch (e) {
    throw new AccessDenied(e as Error)
  }
  if (!authorized) throw new AccessDenied("AccessDenied")
  if (typeof authorized === "string") {
    return {
      redirect: await callbacks.redirect({
        url: authorized,
        baseUrl: options.url.origin,
      }),
    }
  }

  const { callbackUrl, theme } = options
  const token =
    (await provider.generateVerificationToken?.()) ?? randomNumber(6)

  const QUARTER_HOUR_IN_SECONDS = 3600
  const expires = new Date(
    Date.now() + (provider.maxAge ?? QUARTER_HOUR_IN_SECONDS) * 1000
  )

  const secret = provider.secret ?? options.secret

  const baseUrl = new URL(options.basePath, options.url.origin)

  const sendRequest = provider.sendVerificationRequest({
    identifier: phone_number,
    token,
    expires,
    url: `${baseUrl}/callback/${provider.id}?${new URLSearchParams({
      callbackUrl,
      token,
      phone_number,
    })}`,
    provider,
    theme,
    request: toRequest(request),
  })

  const createToken = adapter!.createVerificationToken?.({
    identifier: phone_number,
    token: await createHash(`${token}${secret}`),
    expires,
  })

  await Promise.all([sendRequest, createToken])

  return {
    redirect: `${baseUrl}/verify-request?${new URLSearchParams({
      provider: provider.id,
      type: provider.type,
      phone_number: phone_number,
    })}`,
  }
}

function defaultNormalizer(phone_number?: string) {
  if (!phone_number) throw new Error("Missing phone_number from request body.")
  if (!/^\+\d{11}$/.test(phone_number)) {
    throw new Error(
      "Invalid phone number format, it should be like +XXXXXXXXXXXX"
    )
  }
  return phone_number
}
