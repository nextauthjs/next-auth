import { openidClient } from "./client"
import { oAuth1Client } from "./client-legacy"
import { createState } from "./state-handler"
import { createPKCE } from "./pkce-handler"

import type { AuthorizationParameters } from "openid-client"
import type { InternalOptions } from "../../../lib/types"
import type { IncomingRequest } from "../.."
import type { Cookie } from "../cookie"

/**
 *
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/) | [OAuth 1](https://oauth.net/core/1.0a/#auth_step2)
 */
export default async function getAuthorizationUrl(params: {
  options: InternalOptions<"oauth">
  query: IncomingRequest["query"]
}) {
  const { options, query } = params
  const { logger, provider } = options
  try {
    let params: any = {}

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
      const tokens = (await client.getOAuthRequestToken(params)) as any
      const url = `${
        // @ts-expect-error
        provider.authorization?.url ?? provider.authorization
      }?${new URLSearchParams({
        oauth_token: tokens.oauth_token,
        oauth_token_secret: tokens.oauth_token_secret,
        ...tokens.params,
      })}`

      logger.debug("GET_AUTHORIZATION_URL", { url })
      return { redirect: url }
    }

    const client = await openidClient(options)

    const authorizationParams: AuthorizationParameters = params
    const cookies: Cookie[] = []

    const state = await createState(options)
    if (state) {
      authorizationParams.state = state.value
      cookies.push(state.cookie)
    }

    const pkce = await createPKCE(options)
    if (pkce) {
      authorizationParams.code_challenge = pkce.code_challenge
      authorizationParams.code_challenge_method = pkce.code_challenge_method
      cookies.push(pkce.cookie)
    }

    const url = client.authorizationUrl(authorizationParams)

    logger.debug("GET_AUTHORIZATION_URL", { url, cookies })
    return { redirect: url, cookies }
  } catch (error) {
    logger.error("GET_AUTHORIZATION_URL_ERROR", error as Error)
    throw error
  }
}
