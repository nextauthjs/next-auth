import { createHash } from 'crypto'
import logger from '../../../lib/logger'
import { OAuthCallbackError } from '../../../lib/errors'

/**
 * For OAuth 2.0 flows, if the provider supports state,
 * check if state matches the one sent on signin
 * (a hash of the NextAuth.js CSRF token).
 * @param {import("types/internals").NextAuthRequest} req
 * @param {import("types/internals").NextAuthResponse} res
 */
export async function handleCallback (req, res) {
  const { csrfToken, provider, baseUrl, basePath } = req.options
  try {
    // Provider does not support state, nothing to do.
    if (!provider.protection?.includes('state')) {
      return
    }

    const state = req.query.state || req.body.state
    const expectedState = createHash('sha256').update(csrfToken).digest('hex')

    logger.debug(
      'OAUTH_CALLBACK_PROTECTION',
      'Comparing received and expected state',
      { state, expectedState }
    )
    if (state !== expectedState) {
      throw new OAuthCallbackError('Invalid state returned from OAuth provider')
    }
  } catch (error) {
    logger.error('STATE_ERROR', error)
    return res.redirect(`${baseUrl}${basePath}/error?error=OAuthCallback`)
  }
}

/**
 * Adds CSRF token to the authorizationParams.
 * @param {import("types/internals").NextAuthRequest} req
 * @param {import("types/internals").NextAuthResponse} res
 */
export async function handleSignin (req, res) {
  const { provider, baseUrl, basePath, csrfToken } = req.options
  try {
    if (!provider.protection?.includes('state')) { // Provider does not support state, nothing to do.
      return
    }

    if ('state' in provider) {
      logger.warn(
        'STATE_OPTION_DEPRECATION',
        'The `state` provider option is being replaced with `protection`. See the docs.'
      )
    }

    // A hash of the NextAuth.js CSRF token is used as the state
    const state = createHash('sha256').update(csrfToken).digest('hex')

    provider.authorizationParams = { ...provider.authorizationParams, state }
    logger.debug(
      'OAUTH_CALLBACK_PROTECTION',
      'Added state to authorization params',
      { state }
    )
  } catch (error) {
    logger.error('SIGNIN_OAUTH_ERROR', error)
    return res.redirect(`${baseUrl}${basePath}/error?error=OAuthSignin`)
  }
}

export default { handleSignin, handleCallback }
