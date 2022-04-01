import { oAuth1Client } from "./client-legacy"
import { createState } from "./state-handler"
import { createPKCE } from "./pkce-handler"
import getAuthorizationServer from "./authorization-server"

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

    const authorizationServer = await getAuthorizationServer(provider)

    if (!authorizationServer.authorization_endpoint) throw new Error()
    const authorizationUrl = new URL(authorizationServer.authorization_endpoint)

    for (const [key, value] of Object.entries(params)) {
      authorizationUrl.searchParams.set(key, value as string)
    }

    authorizationUrl.searchParams.set("client_id", provider.clientId as string)
    authorizationUrl.searchParams.set("redirect_uri", provider.callbackUrl)

    if (typeof provider.authorization !== "string" && provider.authorization) {
      const { params: authorizationEndpointParams } = provider.authorization

      authorizationUrl.searchParams.set(
        "response_type",
        (authorizationEndpointParams?.response_type as string) ?? "code"
      )

      if (!authorizationUrl.searchParams.get("scope")) {
        authorizationUrl.searchParams.set(
          "scope",
          (authorizationEndpointParams?.scope as string) ??
            "openid email profile"
        )
      }
    }

    const cookies: Cookie[] = []

    const state = await createState(options)
    if (state) {
      authorizationUrl.searchParams.set("state", state.value)
      cookies.push(state.cookie)
    }

    const pkce = await createPKCE(options)
    if (pkce) {
      authorizationUrl.searchParams.set("code_challenge", pkce.code_challenge)
      authorizationUrl.searchParams.set(
        "code_challenge_method",
        pkce.code_challenge_method
      )
      cookies.push(pkce.cookie)
    }

    logger.debug("GET_AUTHORIZATION_URL", { authorizationUrl, cookies })
    return { redirect: authorizationUrl.href, cookies }
  } catch (error) {
    logger.error("GET_AUTHORIZATION_URL_ERROR", error as Error)
    throw error
  }
}
