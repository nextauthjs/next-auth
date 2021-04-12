import { openidClient, oAuth1Client } from '../oauth/client'
import logger from '../../../lib/logger'
import { getState } from '../oauth/state-handler'

/** @param {import("../..").NextAuthRequest} req */
export default async function getAuthorizationUrl (req) {
  const { provider } = req.options
  // Handle OAuth v1.x
  if (provider.version?.startsWith('1.')) {
    try {
      const client = await oAuth1Client(req.options)
      const oAuthToken = await client.getOAuthRequestToken()
      const url = `${provider.authorizationUrl}?oauth_token=${oAuthToken}`
      logger.debug('GET_AUTHORIZATION_URL', url)
      return url
    } catch (error) {
      logger.error('GET_AUTHORIZATION_URL_ERROR', error)
      throw error
    }
  }

  // TODO: authorizationParams vs params. What's the difference?
  const client = await openidClient(req.options)
  return client.authorizationUrl({
    ...provider.params,
    scope: provider.scope,
    state: getState(req)
  })
}
