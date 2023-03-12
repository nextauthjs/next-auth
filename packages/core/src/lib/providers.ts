import { merge } from "./utils/merge.js"

import type { InternalProvider } from "../types.js"
import type {
  OAuthConfig,
  OAuthConfigInternal,
  OAuthEndpointType,
  OAuthUserConfig,
  Provider,
} from "../providers/index.js"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
  providers: Provider[]
  url: URL
  providerId?: string
}): {
  providers: InternalProvider[]
  provider?: InternalProvider
} {
  const { url, providerId } = params

  const providers = params.providers.map((provider) => {
    const { options: userOptions, ...defaults } = provider

    const id = (userOptions?.id ?? defaults.id) as string
    const merged = merge(defaults, userOptions, {
      signinUrl: `${url}/signin/${id}`,
      callbackUrl: `${url}/callback/${id}`,
    })

    if (provider.type === "oauth" || provider.type === "oidc") {
      return normalizeOAuth(merged)
    }

    return merged
  })

  return {
    providers,
    provider: providers.find(({ id }) => id === providerId),
  }
}

// TODO: Also add discovery here, if some endpoints/config are missing.
// We should return both a client and authorization server config.
function normalizeOAuth(
  c: OAuthConfig<any> | OAuthUserConfig<any>
): OAuthConfigInternal<any> | {} {
  if (c.issuer) c.wellKnown ??= `${c.issuer}/.well-known/openid-configuration`

  const authorization = normalizeEndpoint(c.authorization, c.issuer)
  if (authorization && !authorization.url?.searchParams.has("scope")) {
    authorization.url.searchParams.set("scope", "openid profile email")
  }

  const token = normalizeEndpoint(c.token, c.issuer)

  const userinfo = normalizeEndpoint(c.userinfo, c.issuer)

  return {
    ...c,
    authorization,
    token,
    checks: c.checks ?? ["pkce"],
    userinfo,
    profile: c.profile ?? defaultProfile,
  }
}

function defaultProfile(profile: any) {
  return {
    id: profile.sub ?? profile.id,
    name:
      profile.name ?? profile.nickname ?? profile.preferred_username ?? null,
    email: profile.email ?? null,
    image: profile.picture ?? null,
  }
}
function normalizeEndpoint(
  e?: OAuthConfig<any>[OAuthEndpointType],
  issuer?: string
): OAuthConfigInternal<any>[OAuthEndpointType] {
  if (!e && issuer) return
  if (typeof e === "string") {
    return { url: new URL(e) }
  }
  // If e.url is undefined, it's because the provider config
  // assumes that we will use the issuer endpoint.
  // The existence of either e.url or provider.issuer is checked in
  // assert.ts. We fallback to "https://authjs.dev" to be able to pass around
  // a valid URL even if the user only provided params.
  // NOTE: This need to be checked when constructing the URL
  // for the authorization, token and userinfo endpoints.
  const url = new URL(e?.url ?? "https://authjs.dev")
  if (e?.params != null) {
    for (let [key, value] of Object.entries(e.params)) {
      if (key === "claims") value = JSON.stringify(value)
      url.searchParams.set(key, String(value))
    }
  }
  return { url, request: e?.request, conform: e?.conform }
}
