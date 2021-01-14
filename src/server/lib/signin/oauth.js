import getOAuthClient from '../oauth/client'
import getOAuthClientLegacy from '../oauth/client.legacy'
import { createHash } from 'crypto'
import logger from '../../../lib/logger'

/**
 * Returns an OAuth `/authorization` url with params.
 * @param {import("../../index").NextApiRequestWithOptions} req
 * @docs https://tools.ietf.org/html/rfc6749#section-4.1.1 (/authorize)
 * @docs https://tools.ietf.org/html/rfc7636#section-4.3 (PKCE)
 */
export default async function getAuthorizationUrl (req) {
  try {
    const { provider, csrfToken, secret } = req.options
    const { callbackUrl } = provider

    // Handle OAuth v2.x and OIDC
    if (provider.version?.startsWith('2.')) {
      const client = getOAuthClient(provider)

      const url = new URL(provider.authorizationUrl)
      const authorizeParams = Object.fromEntries(url.searchParams.entries())

      /** @type {import("openid-client").AuthorizationParameters} */
      const params = {
        redirect_uri: provider.callbackUrl,
        scope: provider.scope,
        // Preserve params from authorizationUrl
        ...authorizeParams,
        // Makes it possible to defined params as an object for the provider
        ...provider.authorizationParams
      }

      switch (provider.verification) {
        case 'pkce':
          // TODO: handle PKCE
          // const codeChallenge generators.codeChallenge(codeVerifier)
          // logger.debug('OAUTH_AUTHORIZATION_URL', {
          //   message: 'PKCE code_challenge being sent', codeChallenge
          // })
          // params.code_challenge = codeChallenge
          break
        case 'state': {
          const state = createHash('sha256').update(csrfToken).digest('hex')
          logger.debug('OAUTH_AUTHORIZATION_URL', {
            message: 'State being sent', state
          })
          params.state = state
          break
        }
        case 'none':
        default:
          break
      }

      logger.debug('OAUTH_AUTHORIZATION_URL', { params, provider })
      return client.authorizationUrl(params)
    }

    // Handle OAuth 1.x
    const client = getOAuthClientLegacy(provider)
    const oAuthToken = await client.getOAuthRequestToken(callbackUrl)
    const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
    logger.debug('OAUTH_AUTHORIZATION_URL', { url, provider })
    return url
  } catch (error) {
    logger.error('GET_AUTHORISATION_URL_ERROR', error)
    throw error
  }
}
