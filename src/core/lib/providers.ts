import { merge } from "../../lib/merge"

import type { InternalProvider } from "../../lib/types"
import type { Provider } from "../../providers"
import type { InternalUrl } from "../../lib/parse-url"

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

  const providers = params.providers.map(({ options, ...rest }) => {
    const defaultOptions = normalizeProvider(rest as Provider)
    const userOptions = normalizeProvider(options as Provider)

    return merge(defaultOptions, {
      ...userOptions,
      signinUrl: `${url}/signin/${userOptions?.id ?? rest.id}`,
      callbackUrl: `${url}/callback/${userOptions?.id ?? rest.id}`,
    })
  })

  const provider = providers.find(({ id }) => id === providerId)

  return { providers, provider }
}

function normalizeProvider(provider?: Provider) {
  if (!provider) return

  const normalized: InternalProvider = Object.entries(
    provider
  ).reduce<InternalProvider>((acc, [key, value]) => {
    if (
      ["authorization", "token", "userinfo"].includes(key) &&
      typeof value === "string"
    ) {
      const url = new URL(value)
      acc[key] = {
        url: `${url.origin}${url.pathname}`,
        params: Object.fromEntries(url.searchParams ?? []),
      }
    } else {
      acc[key] = value
    }

    return acc
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
  }, {} as any)

  if (normalized.type === "oauth" && !normalized.version?.startsWith("1.")) {
    // If provider has as an "openid-configuration" well-known endpoint
    // or an "openid" scope request, it will also likely be able to receive an `id_token`
    normalized.idToken = Boolean(
      normalized.idToken ??
        normalized.wellKnown?.includes("openid-configuration") ??
        // @ts-expect-error
        normalized.authorization?.params?.scope?.includes("openid")
    )

    if (!normalized.checks) normalized.checks = ["state"]
  }
  return normalized
}
