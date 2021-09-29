import * as cookie from "../cookie"
import * as jwt from "../../../jwt"
import { generators } from "openid-client"

const PKCE_LENGTH = 64
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
  const codeVerifier = generators.codeVerifier(PKCE_LENGTH)
  const codeChallenge = generators.codeChallenge(codeVerifier)

  // Encrypt code_verifier and save it to an encrypted cookie
  const encryptedCodeVerifier = await jwt.encode({
    maxAge: PKCE_MAX_AGE,
    ...options.jwt,
    token: { code_verifier: codeVerifier },
    encryption: true,
  })

  const cookieExpires = new Date()
  cookieExpires.setTime(cookieExpires.getTime() + PKCE_MAX_AGE * 1000)

  logger.debug("CREATE_PKCE_CHALLENGE_VERIFIER", {
    pkce: {
      code_challenge: codeChallenge,
      code_verifier: codeVerifier,
    },
    pkceLength: PKCE_LENGTH,
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
 * @param {import("src/lib/types").NextAuthRequest} req
 * @return {Promise<string | undefined>}
 */
export async function usePKCECodeVerifier(req, res) {
  /** @type {import("src/providers").OAuthConfig} */
  const provider = req.options.provider
  const { cookies } = req.options
  if (
    !provider?.checks.includes("pkce") ||
    !(cookies.pkceCodeVerifier.name in req.cookies)
  ) {
    return
  }

  const pkce = await jwt.decode({
    ...req.options.jwt,
    token: req.cookies[cookies.pkceCodeVerifier.name],
    maxAge: PKCE_MAX_AGE,
    encryption: true,
  })

  // remove PKCE cookie after it has been used up
  cookie.set(res, cookies.pkceCodeVerifier.name, "", {
    ...cookies.pkceCodeVerifier.options,
    maxAge: 0,
  })

  return pkce?.code_verifier ?? undefined
}
