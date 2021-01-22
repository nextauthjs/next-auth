import oAuthClient from '../oauth/client'
import logger from '../../../lib/logger'

export default async function getAuthorizationUrl (req) {
  const { provider } = req.options

  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    let url = client.getAuthorizeUrl({
      ...provider.authorizationParams,
      ...req.body.authorizationParams,
      redirect_uri: provider.callbackUrl,
      scope: provider.scope
    })

    // If the authorizationUrl specified in the config has query parameters on it
    // make sure they are included in the URL we return.
    //
    // This is a fix for an open issue with the OAuthClient library we are using
    // which inadvertantly strips them.
    //
    // https://github.com/ciaranj/node-oauth/pull/193
    if (provider.authorizationUrl.includes('?')) {
      const parseUrl = new URL(provider.authorizationUrl)
      const baseUrl = `${parseUrl.origin}${parseUrl.pathname}?`
      url = url.replace(baseUrl, provider.authorizationUrl + '&')
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
