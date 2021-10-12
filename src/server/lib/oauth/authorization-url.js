import { openidClient } from "../oauth/client"
import { oAuth1Client } from "../oauth/client-legacy"
import { createState } from "../oauth/state-handler"
import { createPKCE } from "../oauth/pkce-handler"

/**
 *
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/) | [OAuth 1](https://oauth.net/core/1.0a/#auth_step2)
 * @type {import("src/lib/types").NextAuthApiHandler}
 * @returns {string}
 */
export default async function getAuthorizationUrl(req, res) {
  const { logger } = req.options
  try {
    /** @type {import("src/providers").OAuthConfig} */
    const provider = req.options.provider

    const params = {
      ...provider.authorization.params,
      ...req.query,
    }

    // Handle OAuth v1.x
    if (provider.version?.startsWith("1.")) {
      const client = oAuth1Client(req.options)
      const tokens = await client.getOAuthRequestToken(params)
      const url = `${provider.authorization.url}?${new URLSearchParams({
        oauth_token: tokens.oauth_token,
        oauth_token_secret: tokens.oauth_token_secret,
        ...tokens.params,
      })}`

      logger.debug("GET_AUTHORIZATION_URL", { url })
      return url
    }
    const client = await openidClient(req.options)
    const pkce = await createPKCE(req, res)

    const url = client.authorizationUrl({
      ...params,
      ...pkce,
      state: createState(req),
    })

    logger.debug("GET_AUTHORIZATION_URL", { url })
    return url
  } catch (error) {
    logger.error("GET_AUTHORIZATION_URL_ERROR", error)
    throw error
  }
}
