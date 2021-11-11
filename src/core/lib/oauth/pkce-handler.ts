import { Cookie } from "../cookie"
import * as jwt from "../../../jwt"
import { generators } from "openid-client"
import { InternalOptions } from "src/lib/types"

const PKCE_CODE_CHALLENGE_METHOD = "S256"
const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/**
 * Returns `code_challenge` and `code_challenge_method`
 * and saves them in a cookie.
 * @type {import("src/lib/types").InternalOptions}
 * @returns {Promise<undefined | {
 *  code_challenge: string
 *  code_challenge_method: "S256"
 *  cookie: import("../cookie").Cookie
 * }>
 */

type PKCE = Promise<
  | undefined
  | {
      code_challenge: string
      code_challenge_method: "S256"
      cookie: Cookie
    }
>

export async function createPKCE(options: InternalOptions<"oauth">): PKCE {
  const { cookies, logger } = options
  /** @type {import("src/providers").OAuthConfig} */
  const provider = options.provider
  if (!provider.checks?.includes("pkce")) {
    // Provider does not support PKCE, return nothing.
    return
  }
  const code_verifier = generators.codeVerifier()
  const code_challenge = generators.codeChallenge(code_verifier)

  const expires = new Date()
  expires.setTime(expires.getTime() + PKCE_MAX_AGE * 1000)

  // Encrypt code_verifier and save it to an encrypted cookie
  const encodedVerifier = await jwt.encode({
    ...options.jwt,
    maxAge: PKCE_MAX_AGE,
    token: { code_verifier },
  })

  logger.debug("CREATE_PKCE_CHALLENGE_VERIFIER", {
    code_challenge,
    code_challenge_method: PKCE_CODE_CHALLENGE_METHOD,
    code_verifier,
    PKCE_MAX_AGE,
  })

  return {
    code_challenge,
    code_challenge_method: PKCE_CODE_CHALLENGE_METHOD,
    cookie: {
      name: cookies.pkceCodeVerifier.name,
      value: encodedVerifier,
      options: { ...cookies.pkceCodeVerifier.options, expires },
    },
  }
}

/**
 * Returns code_verifier if provider uses PKCE,
 * and clears the container cookie afterwards.
 */
export async function usePKCECodeVerifier(
  codeVerifier: string | undefined,
  options: InternalOptions<"oauth">
): Promise<{ codeVerifier: string; cookie: Cookie } | undefined> {
  const { cookies, provider } = options

  if (!provider?.checks?.includes("pkce") || !codeVerifier) {
    return
  }

  const pkce = (await jwt.decode({
    ...options.jwt,
    token: codeVerifier,
  })) as any

  return {
    codeVerifier: pkce?.code_verifier ?? undefined,
    cookie: {
      name: cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...cookies.pkceCodeVerifier.options, maxAge: 0 },
    },
  }
}
