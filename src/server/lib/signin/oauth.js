import oAuthClient from '../oauth/client'
import { createHash } from 'crypto'
import logger from '../../../lib/logger'

export default async function getAuthorizationUrl (req) {
  const { provider, csrfToken, pkce } = req.options

  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    let url = client.getAuthorizeUrl({
      ...provider.authorizationParams,
      ...req.body.authorizationParams,
      redirect_uri: provider.callbackUrl,
      scope: provider.scope,
      // A hash of the NextAuth.js CSRF token is used as the state
      state: createHash('sha256').update(csrfToken).digest('hex')
    })

    // If the authorizationUrl specified in the config has query parameters on it
    // make sure they are included in the URL we return.
    //
    // This is a fix for an open issue with the OAuthClient library we are using
    // which inadvertantly strips them.
    //
    // https://github.com/ciaranj/node-oauth/pull/193
    if (provider.authorizationUrl.includes('?')) {
      const providerParams = new URLSearchParams(provider.authorizationUrl.split('?')[1])
      const newParams = { ...url.searchParams, ...providerParams }
      url = new URL(newParams.toString(), url)
    }

    if (pkce) {
      url.searchParams.append('code_challenge', pkce.code_challenge)
      url.searchParams.append('code_challenge_method', 'S256')
    }

    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  }

  try {
    const oAuthToken = await client.getOAuthRequestToken(provider.callbackUrl)
    const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  } catch (error) {
    logger.error('GET_AUTHORIZATION_URL_ERROR', error)
    throw error
  }
}
