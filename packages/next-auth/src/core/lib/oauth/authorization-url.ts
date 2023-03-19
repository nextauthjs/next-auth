import { openidClient } from "./client"
import { oAuth1Client } from "./client-legacy"
import { createState } from "./state-handler"
import { createNonce } from "./nonce-handler"
import { createPKCE } from "./pkce-handler"

import type { AuthorizationParameters } from "openid-client"
import type { InternalOptions } from "../../types"
import type { RequestInternal } from "../.."
import type { Cookie } from "../cookie"

/**
 *
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/) | [OAuth 1](https://oauth.net/core/1.0a/#auth_step2)
 */
export default async function getAuthorizationUrl({
  options,
  query,
}: {
  options: InternalOptions<"oauth">
  query: RequestInternal["query"]
}) {
  const { logger, provider } = options
  let params: any = {}

  if (typeof provider.authorization === "string") {
    const parsedUrl = new URL(provider.authorization)
    const parsedParams = Object.fromEntries(parsedUrl.searchParams)
    params = { ...params, ...parsedParams }
  } else {
    params = { ...params, ...provider.authorization?.params }
  }

  params = { ...params, ...query }

  // Handle OAuth v1.x
  if (provider.version?.startsWith("1.")) {
    const client = oAuth1Client(options)
    const tokens = (await client.getOAuthRequestToken(params)) as any
    const url = `${provider.authorization?.url}?${new URLSearchParams({
      oauth_token: tokens.oauth_token,
      oauth_token_secret: tokens.oauth_token_secret,
      ...tokens.params,
    })}`

    logger.debug("GET_AUTHORIZATION_URL", { url, provider })
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

  const nonce = await createNonce(options)
  if (nonce) {
    authorizationParams.nonce = nonce.value
    cookies.push(nonce.cookie)
  }

  const pkce = await createPKCE(options)
  if (pkce) {
    authorizationParams.code_challenge = pkce.code_challenge
    authorizationParams.code_challenge_method = pkce.code_challenge_method
    cookies.push(pkce.cookie)
  }

  const url = client.authorizationUrl(authorizationParams)

  logger.debug("GET_AUTHORIZATION_URL", { url, cookies, provider })
  return { redirect: url, cookies }
}
