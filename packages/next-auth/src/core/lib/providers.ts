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
}): {
  providers: InternalProvider[]
  provider?: InternalProvider
} {
  const { url, providerId } = params

  const providers = params.providers.map((provider) => {
    let { options: userOptions, ...rest } = provider
    if (provider.type === "oauth") {
      // @ts-expect-error after normalization, we don't match the initial type of rest
      rest = normalizeOAuth(rest as OAuthConfig<any>)
      userOptions = normalizeOAuth(userOptions as OAuthUserConfig<any>)
    }
    const id = (userOptions?.id as string | undefined) ?? rest.id
    return merge(rest, {
      ...userOptions,
      signinUrl: `${url}/signin/${id}`,
      callbackUrl: `${url}/callback/${id}`,
    })
  })

  return {
    providers,
    provider: providers.find(({ id }) => id === providerId),
  }
}

/**
 * Transform OAuth options `authorization`, `token` and `profile` to `{ url: URL }`
 */
function normalizeOAuth(
  config?: OAuthConfig<any> | OAuthUserConfig<any>
): OAuthConfigInternal<any> | {} {
  if (!config) return {}

  const authorization = normalizeEndpoint(config.authorization)
  const token = normalizeEndpoint(config.token)
  const userinfo = normalizeEndpoint(config.userinfo)

  if (!config.version?.startsWith("1.")) {
    config.idToken =
      config.idToken ??
      // If a provider has as an "openid-configuration" well-known endpoint
      config.wellKnown?.includes("openid-configuration") ??
      // or an "openid" scope request, it will also likely be return an `id_token`
      authorization?.url.searchParams.get("scope")?.includes("openid")

    // Set default check to state
    config.checks = Array.isArray(config.checks)
      ? config.checks
      : [config.checks ?? "state"]
  }

  return {
    ...config,
    authorization,
    token,
    userinfo,
  } as unknown as OAuthConfigInternal<any>
}

function normalizeEndpoint(
  e?: OAuthConfig<any>[OAuthEndpointType]
): OAuthConfigInternal<any>[OAuthEndpointType] {
  if (!e) return
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
