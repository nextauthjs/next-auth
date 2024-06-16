import * as checks from "../callback/oauth/checks.js"

import type { AuthorizationServer } from "oauth4webapi"
import type { InternalOptions, RequestInternal } from "../../../types.js"
import type { Cookie } from "../../utils/cookie.js"

/**
 * Generates an authorization/request token URL.
 *
 * [OAuth 2](https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/)
 */
export async function getAuthorizationUrl(
  query: RequestInternal["query"],
  options: InternalOptions<"oauth" | "oidc">
) {
  const { logger, provider } = options
  let as: AuthorizationServer | undefined
  let url: URL

  const { url: u, as: a } = provider.authorization
  url = u
  as = a

  const authParams = url.searchParams

  let redirect_uri: string = provider.callbackUrl
  let data: object | undefined
  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl
    data = { origin: provider.callbackUrl }
    logger.debug("using redirect proxy", { redirect_uri, data })
  }

  const params = Object.assign(
    {
      response_type: "code",
      // clientId can technically be undefined, should we check this in assert.ts or rely on the Authorization Server to do it?
      client_id: provider.clientId,
      redirect_uri,
      // @ts-expect-error TODO:
      ...provider.authorization?.params,
    },
    Object.fromEntries(url.searchParams ?? []),
    query
  )

  for (const k in params) authParams.set(k, params[k])

  const cookies: Cookie[] = []

  const state = await checks.state.create(options, data)
  if (state) {
    authParams.set("state", state.value)
    cookies.push(state.cookie)
  }

  if (provider.checks?.includes("pkce")) {
    if (as && !as.code_challenge_methods_supported?.includes("S256")) {
      // We assume S256 PKCE support, if the server does not advertise that,
      // a random `nonce` must be used for CSRF protection.
      if (provider.type === "oidc") provider.checks = ["nonce"] as any
    } else {
      const { value, cookie } = await checks.pkce.create(options)
      authParams.set("code_challenge", value)
      authParams.set("code_challenge_method", "S256")
      cookies.push(cookie)
    }
  }

  const nonce = await checks.nonce.create(options)
  if (nonce) {
    authParams.set("nonce", nonce.value)
    cookies.push(nonce.cookie)
  }

  logger.debug("authorization url is ready", { url, cookies, provider })
  return { redirect: url.toString(), cookies }
}
