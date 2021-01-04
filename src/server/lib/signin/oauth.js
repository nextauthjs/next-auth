import oAuthClient from '../oauth/client'
import { createHash } from 'crypto'
import logger from '../../../lib/logger'

export default async function oauth (provider, csrfToken, authParams) {
  const { callbackUrl } = provider
  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    let url = client.getAuthorizeUrl({
      ...authParams,
      redirect_uri: callbackUrl,
      scope: provider.scope,
      // A hash of the NextAuth.js CSRF token is used as the state
      state: createHash('sha256').update(csrfToken).digest('hex'),
      ...provider.additionalAuthorizeParams
    })

    // If the authorizationUrl specified in the config has query parameters on it
    // make sure they are included in the URL we return.
    //
    // This is a fix for an open issue with the oAuthClient library we are using
    // which inadvertantly strips them.
    //
    // https://github.com/ciaranj/node-oauth/pull/193
    if (provider.authorizationUrl.includes('?')) {
      const parseUrl = new URL(provider.authorizationUrl)
      const baseUrl = `${parseUrl.origin}${parseUrl.pathname}?`
      url = url.replace(baseUrl, provider.authorizationUrl + '&')
    }

    return url
  }

  try {
    const oAuthToken = await client.getOAuthRequestToken(callbackUrl)
    return `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
  } catch (error) {
    logger.error('GET_AUTHORISATION_URL_ERROR', error)
    throw error
  }
}
