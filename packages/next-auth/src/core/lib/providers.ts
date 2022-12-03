import { merge } from "../../utils/merge"

import type { InternalProvider } from "../types"
import type {
  OAuthConfigInternal,
  OAuthConfig,
  Provider,
  OAuthUserConfig,
  OAuthEndpointType,
} from "../../providers"
import type { InternalUrl } from "../../utils/parse-url"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
  providers: Provider[]
  url: InternalUrl
  providerId?: string
  runtime?: "web" | "nodejs"
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

    if (provider.type === "oauth") {
      const p = normalizeOAuth(merged)

      return p
    }

    return merged
  })

  return {
    providers,
    provider: providers.find(({ id }) => id === providerId),
  }
}

function normalizeOAuth(
  c?: OAuthConfig<any> | OAuthUserConfig<any>,
  runtime?: "web" | "nodejs"
): OAuthConfigInternal<any> | {} {
  if (!c) return {}

  const hasIssuer = !!c.issuer
  const authorization = normalizeEndpoint(c.authorization, hasIssuer)

  if (!c.version?.startsWith("1.")) {
    // Set default check to state
    c.checks ??= ["pkce"]
    c.checks = Array.isArray(c.checks) ? c.checks : [c.checks]
    if (runtime === "web" && !c.checks.includes("pkce")) c.checks.push("pkce")

    if (!Array.isArray(c.checks)) c.checks = [c.checks]

    // REVIEW: Deprecate `idToken` in favor of `type: "oidc"`?
    c.idToken ??=
      // If a provider has as an "openid-configuration" well-known endpoint
      c.wellKnown?.includes("openid-configuration") ??
      // or an "openid" scope request, it must also return an `id_token`
      authorization?.url.searchParams.get("scope")?.includes("openid")

    if (c.issuer && c.idToken) {
      c.wellKnown ??= `${c.issuer}/.well-known/openid-configuration`
    }
  }

  return {
    ...c,
    ...(authorization ? { authorization } : undefined),
    ...(c.token ? { token: normalizeEndpoint(c.token, hasIssuer) } : undefined),
    ...(c.userinfo
      ? { userinfo: normalizeEndpoint(c.userinfo, hasIssuer) }
      : undefined),
  }
}

function normalizeEndpoint(
  e?: OAuthConfig<any>[OAuthEndpointType],
  hasIssuer?: boolean
): OAuthConfigInternal<any>[OAuthEndpointType] {
  if (!e || hasIssuer) return
  if (typeof e === "string") {
    return { url: new URL(e) }
  }
  // If v.url is undefined, it's because the provider config
  // assumes that we will use the issuer endpoint.
  // The existence of either v.url or provider.issuer is checked in
  // assert.ts
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = new URL(e.url!)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  for (const k in e.params) url.searchParams.set(k, e.params[k] as any)

  return { url }
}
