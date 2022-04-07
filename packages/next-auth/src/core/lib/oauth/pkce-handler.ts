import * as jwt from "../../../jwt"
import {
  generateRandomCodeVerifier,
  calculatePKCECodeChallenge,
} from "@panva/oauth4webapi"
import type { InternalOptions } from "src/lib/types"
import type { Cookie } from "../cookie"

const PKCE_CODE_CHALLENGE_METHOD = "S256"
const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/**
 * Returns `code_challenge` and `code_challenge_method`
 * and saves them in a cookie.
 */
export async function createPKCE(options: InternalOptions<"oauth">): Promise<{
  code_challenge: string
  code_challenge_method: "S256"
  cookie: Cookie
}> {
  const { cookies, logger } = options
  const code_verifier = generateRandomCodeVerifier()
  const code_challenge = await calculatePKCECodeChallenge(code_verifier)

  const expires = new Date()
  expires.setTime(expires.getTime() + PKCE_MAX_AGE * 1000)

  // Encrypt code_verifier and save it to an encrypted cookie
  const encryptedCodeVerifier = await jwt.encode({
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
      value: encryptedCodeVerifier,
      options: { ...cookies.pkceCodeVerifier.options, expires },
    },
  }
}

/**
 * Returns `code_verifier`,
 * and clears the container cookie afterwards.
 */
export async function usePKCECodeVerifier(
  codeVerifier: string | undefined,
  options: InternalOptions<"oauth">
): Promise<{ codeVerifier: string; cookie: Cookie }> {
  if (codeVerifier === undefined) throw new Error("Invalid code verifier")

  const { cookies } = options

  const pkce = await jwt.decode({
    ...options.jwt,
    token: codeVerifier,
  })

  if (pkce === null) throw new Error("Invalid code verifier")

  return {
    codeVerifier: pkce.code_verifier as string,
    cookie: {
      name: cookies.pkceCodeVerifier.name,
      value: "",
      options: { ...cookies.pkceCodeVerifier.options, maxAge: 0 },
    },
  }
}
