import { oAuthClient, oAuth2Client } from './index'

export default (provider, callback) => {
  const { type, callbackUrl } = provider
  if (type === 'oauth') {
    const client = oAuthClient(provider)
    if (provider.version && provider.version.startsWith('2.')) {
      // Handle oAuth v2.x
      let url = client.getAuthorizeUrl({
        redirect_uri: provider.callbackUrl,
        scope: provider.scope,
        state: '' // @FIXME add random state token
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

      callback(null, url)
    } else {
      // Handle oAuth v1.x
      client.getOAuthRequestToken((error, oAuthToken) => {
        if (error) {
          console.error('GET_AUTHORISATION_URL_ERROR', error)
        }
        const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
        callback(error, url)
      }, callbackUrl)
    }
  } else if (type === 'oauth2') {
    const client = oAuth2Client(provider)
    const url = client.code.getUri()
    callback(null, url)
  }
}
