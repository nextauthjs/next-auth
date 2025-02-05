import * as checks from "../callback/oauth/checks.js"
import * as o from "oauth4webapi"

import type { InternalOptions, RequestInternal } from "../../../types.js"
import type { Cookie } from "../../utils/cookie.js"
import { customFetch } from "../../symbols.js"

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

  let url = provider.authorization?.url
  let as: o.AuthorizationServer | undefined

  // Falls back to authjs.dev if the user only passed params
  if (!url || url.host === "authjs.dev") {
    // If url is undefined, we assume that issuer is always defined
    // We check this in assert.ts

    const issuer = new URL(provider.issuer!)
    const discoveryResponse = await o.discoveryRequest(issuer, {
      [o.customFetch]: provider[customFetch],
      // TODO: move away from allowing insecure HTTP requests
      [o.allowInsecureRequests]: true,
    })
    const as = await o
      .processDiscoveryResponse(issuer, discoveryResponse)
      .catch((error) => {
        if (!(error instanceof TypeError) || error.message !== "Invalid URL")
          throw error
        throw new TypeError(
          `Discovery request responded with an invalid issuer. expected: ${issuer}`
        )
      })

    if (!as.authorization_endpoint) {
      throw new TypeError(
        "Authorization server did not provide an authorization endpoint."
      )
    }

    url = new URL(as.authorization_endpoint)
  }

  const authParams = url.searchParams

  let redirect_uri: string = provider.callbackUrl
  let data: string | undefined
  if (!options.isOnRedirectProxy && provider.redirectProxyUrl) {
    redirect_uri = provider.redirectProxyUrl
    data = provider.callbackUrl
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
    Object.fromEntries(provider.authorization?.url.searchParams ?? []),
    query
  )

  for (const k in params) authParams.set(k, params[k])

  const cookies: Cookie[] = []

  if (
    // Otherwise "POST /redirect_uri" wouldn't include the cookies
    provider.authorization?.url.searchParams.get("response_mode") ===
    "form_post"
  ) {
    options.cookies.state.options.sameSite = "none"
    options.cookies.state.options.secure = true
    options.cookies.nonce.options.sameSite = "none"
    options.cookies.nonce.options.secure = true
  }

  const state = await checks.state.create(options, data)
  if (state) {
    authParams.set("state", state.value)
    cookies.push(state.cookie)
  }

  if (provider.checks?.includes("pkce")) {
    if (as && !as.code_challenge_methods_supported?.includes("S256")) {
      // We assume S256 PKCE support, if the server does not advertise that,
      // a random `nonce` must be used for CSRF protection.
      if (provider.type === "oidc") provider.checks = ["nonce"]
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

  // TODO: This does not work in normalizeOAuth because authorization endpoint can come from discovery
  // Need to make normalizeOAuth async
  if (provider.type === "oidc" && !url.searchParams.has("scope")) {
    url.searchParams.set("scope", "openid profile email")
  }

  logger.debug("authorization url is ready", { url, cookies, provider })
  return { redirect: url.toString(), cookies }
}
