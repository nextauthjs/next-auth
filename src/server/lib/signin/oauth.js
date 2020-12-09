import oAuthClient from '../oauth/client'
import { createHash } from 'crypto'
import logger from '../../../lib/logger'

export default function oAuthSignin ({ provider, csrfToken, callback, authParams, codeChallenge }) {
  const { callbackUrl } = provider
  const client = oAuthClient(provider)
  if (provider.version?.startsWith('2.')) {
    // Handle OAuth v2.x
    let url = new URL(client.getAuthorizeUrl({
      ...authParams,
      redirect_uri: provider.callbackUrl,
      scope: provider.scope,
      // A hash of the NextAuth.js CSRF token is used as the state
      state: createHash('sha256').update(csrfToken).digest('hex'),
      ...provider.additionalAuthorizeParams
    }))

    // If the authorizationUrl specified in the config has query parameters on it
    // make sure they are included in the URL we return.
    //
    // This is a fix for an open issue with the oAuthClient library we are using
    // which inadvertantly strips them.
    //
    // https://github.com/ciaranj/node-oauth/pull/193
    if (provider.authorizationUrl.includes('?')) {
      const providerParams = new URLSearchParams(provider.authorizationUrl.split('?')[1])
      const newParams = { ...url.searchParams, ...providerParams }
      url = new URL(newParams.toString(), url)
    }

    if (provider.pkce) {
      url.searchParams.append('code_challenge', codeChallenge)
      url.searchParams.append('code_challenge_method', 'S256')
    }

    callback(null, url)
  } else {
    // Handle OAuth v1.x
    client.getOAuthRequestToken((error, oAuthToken) => {
      if (error) {
        logger.error('GET_AUTHORISATION_URL_ERROR', error)
      }
      const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
      callback(error, url)
    }, callbackUrl)
  }
}
