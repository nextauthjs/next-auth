import pkceChallenge from 'pkce-challenge'
import jwt from '../../lib/jwt'
import * as cookie from '../lib/cookie'
import logger from 'src/lib/logger'

const PKCE_LENGTH = 64
const PKCE_CODE_CHALLENGE_METHOD = 'S256' // can be 'plain', not recommended https://tools.ietf.org/html/rfc7636#section-4.2
const PKCE_MAX_AGE = 60 * 15 // 15 minutes in seconds

/** Adds `code_verifier` to `req.options.pkce`, and removes the corresponding cookie */
export async function handleCallback (req, res) {
  const { cookies, provider, baseUrl, basePath } = req.options
  try {
    if (provider.protection !== 'pkce') { // Provider does not support PKCE, nothing to do.
      return
    }

    if (!(cookies.pkceCodeVerifier.name in req.cookies)) {
      throw new Error('The code_verifier cookie was not found.')
    }
    const pkce = await jwt.decode({
      ...req.options.jwt,
      token: req.cookies[cookies.pkceCodeVerifier.name],
      maxAge: PKCE_MAX_AGE,
      encryption: true
    })
    cookie.set(res, cookies.pkceCodeVerifier.name, null, { maxAge: 0 }) // remove PKCE after it has been used
    req.options.pkce = pkce
  } catch (error) {
    logger.error('PKCE_ERROR', error)
    return `${baseUrl}${basePath}/error?error=Configuration`
  }
}

/** Adds `code_challenge` and `code_challenge_method` to `req.options.pkce`. */
export async function handleSignin (req, res) {
  const { cookies, provider, baseUrl, basePath } = req.options
  try {
    if (provider.protection !== 'pkce') { // Provider does not support PKCE, nothing to do.
      return
    }
    // Started login flow, add generated pkce to req.options and (encrypted) code_verifier to a cookie
    const pkce = pkceChallenge(PKCE_LENGTH)
    req.options.pkce = {
      code_challenge: pkce.code_challenge,
      code_challenge_method: PKCE_CODE_CHALLENGE_METHOD
    }
    const encryptedCodeVerifier = await jwt.encode({
      ...req.options.jwt,
      maxAge: PKCE_MAX_AGE,
      token: { code_verifier: pkce.code_verifier },
      encryption: true
    })

    const cookieExpires = new Date()
    cookieExpires.setTime(cookieExpires.getTime() + (PKCE_MAX_AGE * 1000))
    cookie.set(res, cookies.pkceCodeVerifier.name, encryptedCodeVerifier, {
      expires: cookieExpires.toISOString(),
      ...cookies.pkceCodeVerifier.options
    })
  } catch (error) {
    logger.error('PKCE_ERROR', error)
    return `${baseUrl}${basePath}/error?error=Configuration`
  }
}

export default {
  handleSignin, handleCallback
}
