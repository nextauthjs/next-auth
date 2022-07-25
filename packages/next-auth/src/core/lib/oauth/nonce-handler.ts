import { generators } from "openid-client"

import type { InternalOptions } from "../../types"
import type { Cookie } from "../cookie"

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/** Returns nonce if the provider supports it */
export async function createNonce(
  options: InternalOptions<"oauth">
): Promise<{ cookie: Cookie; value: string } | undefined> {
  const { logger, provider, jwt, cookies } = options

  if (!provider.checks?.includes("nonce")) {
    // Provider does not support nonce, return nothing
    return
  }

  const nonce = generators.nonce()

  const encodedNonce = await jwt.encode({
    ...jwt,
    maxAge: NONCE_MAX_AGE,
    token: { nonce },
  })

  logger.debug("CREATE_NONCE", { nonce, maxAge: NONCE_MAX_AGE })

  const expires = new Date()
  expires.setTime(expires.getTime() + NONCE_MAX_AGE * 1000)
  return {
    value: nonce,
    cookie: {
      name: cookies.nonce.name,
      value: encodedNonce,
      options: { ...cookies.nonce.options, expires },
    },
  }
}

/**
 * Returns nonce from if the provider supports nonces,
 * and clears the container cookie afterwards.
 */
export async function useNonce(
  nonce: string | undefined,
  options: InternalOptions<"oauth">
): Promise<{ value: string; cookie: Cookie } | undefined> {
  const { cookies, provider, jwt } = options

  if (!provider.checks?.includes("nonce") || !nonce) return

  const value = (await jwt.decode({ ...options.jwt, token: nonce })) as any

  return {
    value: value?.nonce ?? undefined,
    cookie: {
      name: cookies.nonce.name,
      value: "",
      options: { ...cookies.pkceCodeVerifier.options, maxAge: 0 },
    },
  }
}
