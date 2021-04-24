import { openidClient, oAuth1Client } from "../oauth/client"
import logger from "../../../lib/logger"
import { getState } from "../oauth/state-handler"

/** @param {import("types/internals").NextAuthRequest} req */
export default async function getAuthorizationUrl(req) {
  const { provider } = req.options

  delete req.query?.nextauth
  const params = {
    ...provider.params,
    ...req.query,
  }

  // Handle OAuth v1.x
  if (provider.version?.startsWith("1.")) {
    try {
      const tokens = await oAuth1Client.getOAuthRequestToken(params)
      const url = `${provider.authorizationUrl}?${new URLSearchParams({
        oauth_token: tokens.oauth_token,
        oauth_token_secret: tokens.oauth_token_secret,
        ...tokens.params,
      })}`
      logger.debug("GET_AUTHORIZATION_URL", url)
      return url
    } catch (error) {
      logger.error("GET_AUTHORIZATION_URL_ERROR", error)
      throw error
    }
  }

  // TODO: authorizationParams vs params. What's the difference?
  const client = await openidClient(req.options)
  return client.authorizationUrl({
    ...params,
    scope: provider.scope,
    state: getState(req),
  })
}
