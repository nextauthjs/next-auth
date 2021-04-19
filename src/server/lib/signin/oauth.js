import oAuthClient from '../oauth/client'
import logger from '../../../lib/logger'

/** @param {import("types/internals").NextAuthRequest} req */
export default async function getAuthorizationUrl (req) {
  const { provider } = req.options

  delete req.query?.nextauth
  const params = {
    ...provider.authorizationParams,
    ...req.query
  }

  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    let url = client.getAuthorizeUrl({
      ...params,
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
    const tokens = await client.getOAuthRequestToken(params)
    const url = `${provider.authorizationUrl}?${new URLSearchParams({
      oauth_token: tokens.oauth_token,
      oauth_token_secret: tokens.oauth_token_secret,
      ...tokens.params
    })}`
    logger.debug('GET_AUTHORIZATION_URL', url)
    return url
  } catch (error) {
    logger.error('GET_AUTHORIZATION_URL_ERROR', error)
    throw error
  }
}
