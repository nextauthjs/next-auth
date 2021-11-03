import * as jwt from "../../../jwt"
import { generators } from "openid-client"
import type { InternalOptions } from "src/lib/types"
import type { Cookie } from "../cookie"

const PKCE_CODE_CHALLENGE_METHOD = "S256"
const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/**
 * Returns `code_challenge` and `code_challenge_method`
 * and saves them in a cookie.
 */
export async function createPKCE(options: InternalOptions<"oauth">): Promise<
  | undefined
  | {
      code_challenge: string
      code_challenge_method: "S256"
      cookie: Cookie
    }
> {
  const { cookies, logger, provider } = options
  if (!provider.checks?.includes("pkce")) {
    // Provider does not support PKCE, return nothing.
    return
  }
  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  // Encrypt code_verifier and save it to an encrypted cookie
  const encryptedCodeVerifier = await jwt.encode({
    ...options.jwt,
    maxAge: PKCE_MAX_AGE,
    token: { code_verifier: codeVerifier },
  })

  const cookieExpires = new Date()
  cookieExpires.setTime(cookieExpires.getTime() + PKCE_MAX_AGE * 1000)

  logger.debug("CREATE_PKCE_CHALLENGE_VERIFIER", {
    pkce: {
      code_challenge: codeChallenge,
      code_verifier: codeVerifier,
    },
    method: PKCE_CODE_CHALLENGE_METHOD,
  })
  return {
    cookie: {
      name: cookies.pkceCodeVerifier.name,
      value: encryptedCodeVerifier,
      options: {
        ...cookies.pkceCodeVerifier.options,
        expires: cookieExpires,
      },
    },
    code_challenge: codeChallenge,
    code_challenge_method: PKCE_CODE_CHALLENGE_METHOD,
  }
}

/**
 * Returns code_verifier if provider uses PKCE,
 * and clears the cookie afterwards.
 */
export async function usePKCECodeVerifier(params: {
  options: InternalOptions<"oauth">
  codeVerifier?: string
}): Promise<
  | {
      codeVerifier?: string
      cookie?: Cookie
    }
  | undefined
> {
  const { options, codeVerifier } = params
  const { cookies, provider } = options

  if (!provider?.checks?.includes("pkce") || !codeVerifier) {
    return
  }

  const pkce = await jwt.decode({
    ...options.jwt,
    token: codeVerifier,
  })

  // remove PKCE cookie after it has been used up
  const cookie: Cookie = {
    name: cookies.pkceCodeVerifier.name,
    value: "",
    options: {
      ...cookies.pkceCodeVerifier.options,
      maxAge: 0,
    },
  }

  return {
    codeVerifier: (pkce?.code_verifier as any) ?? undefined,
    cookie,
  }
}
