import * as o from "oauth4webapi"
import * as jwt from "../../jwt/index.js"

import type { InternalOptions } from "../../index.js"
import type { Cookie } from "../cookie.js"

const NONCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/**
 * Returns nonce if the provider supports it
 * and saves it in a cookie
 */
export async function createNonce(options: InternalOptions<"oauth">): Promise<
  | undefined
  | {
      value: string
      cookie: Cookie
    }
> {
  const { cookies, logger, provider } = options
  if (!provider.checks?.includes("nonce")) {
    // Provider does not support nonce, return nothing.
    return
  }

  const nonce = o.generateRandomNonce()

  const expires = new Date()
  expires.setTime(expires.getTime() + NONCE_MAX_AGE * 1000)

  // Encrypt nonce and save it to an encrypted cookie
  const encryptedNonce = await jwt.encode({
    ...options.jwt,
    maxAge: NONCE_MAX_AGE,
    token: { nonce },
  })

  logger.debug("CREATE_ENCRYPTED_NONCE", {
    nonce,
    maxAge: NONCE_MAX_AGE,
  })

  return {
    cookie: {
      name: cookies.nonce.name,
      value: encryptedNonce,
      options: { ...cookies.nonce.options, expires },
    },
    value: nonce,
  }
}

/**
 * Returns nonce from if the provider supports nonce,
 * and clears the container cookie afterwards.
 */
export async function useNonce(
  nonce: string | undefined,
  options: InternalOptions<"oauth">
): Promise<{ value: string; cookie: Cookie } | undefined> {
  const { cookies, provider } = options

  if (!provider?.checks?.includes("nonce") || !nonce) {
    return
  }

  const value = (await jwt.decode({ ...options.jwt, token: nonce })) as any

  return {
    value: value?.value ?? undefined,
    cookie: {
      name: cookies.nonce.name,
      value: "",
      options: { ...cookies.nonce.options, maxAge: 0 },
    },
  }
}
