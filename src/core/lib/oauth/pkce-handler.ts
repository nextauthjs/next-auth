import * as cookie from "../cookie"
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
export async function createPKCE(options) {
  const { cookies, logger } = options
  /** @type {import("src/providers").OAuthConfig} */
  const provider = options.provider
  if (!provider.checks?.includes("pkce")) {
    // Provider does not support PKCE, return nothing.
    return
  }
  const codeVerifier = generators.codeVerifier()
  const codeChallenge = generators.codeChallenge(codeVerifier)

  // Encrypt code_verifier and save it to an encrypted cookie
  const encryptedCodeVerifier = await jwt.encode({
    maxAge: PKCE_MAX_AGE,
    ...options.jwt,
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
        expires: cookieExpires.toISOString(),
        ...cookies.pkceCodeVerifier.options,
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
      cookie?: cookie.Cookie
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
  const cookie: cookie.Cookie = {
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
