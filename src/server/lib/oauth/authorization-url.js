import { openidClient } from "../oauth/client"
import { oAuth1Client } from "../oauth/client-legacy"
import { createState } from "../oauth/state-handler"
import { createPKCE } from "../oauth/pkce-handler"

/**
 *
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/) | [OAuth 1](https://oauth.net/core/1.0a/#auth_step2)
 * @param {{
 *   options: import("src/lib/types").InternalOptions
 *   query: import("src/server").IncomingRequest["query"]
 * }}
 * @returns {import("src/server").OutgoingResponse}
 */
export default async function getAuthorizationUrl({ options, query }) {
  const { logger } = options
  try {
    /** @type {import("src/providers").OAuthConfig} */
    const provider = options.provider

    let params = {}

    if (typeof provider.authorization === "string") {
      const parsedUrl = new URL(provider.authorization)
      const parsedParams = Object.fromEntries(parsedUrl.searchParams.entries())
      params = { ...params, ...parsedParams }
    } else {
      params = { ...params, ...provider.authorization?.params }
    }

    params = { ...params, ...query }

    // Handle OAuth v1.x
    if (provider.version?.startsWith("1.")) {
      const client = oAuth1Client(options)
      const tokens = await client.getOAuthRequestToken(params)
      const url = `${provider.authorization}?${new URLSearchParams({
        oauth_token: tokens.oauth_token,
        oauth_token_secret: tokens.oauth_token_secret,
        ...tokens.params,
      })}`

      logger.debug("GET_AUTHORIZATION_URL", { url })
      return { redirect: url }
    }

    const cookies = []
    const client = await openidClient(options)
    const pkce = await createPKCE(options)
    if (pkce?.cookie) {
      cookies.push(pkce.cookie)
    }

    const url = client.authorizationUrl({
      ...params,
      ...pkce,
      state: createState(options),
    })

    logger.debug("GET_AUTHORIZATION_URL", { url })
    return {
      redirect: url,
      cookies,
    }
  } catch (error) {
    logger.error("GET_AUTHORIZATION_URL_ERROR", error)
    throw error
  }
}
