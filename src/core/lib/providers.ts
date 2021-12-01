import { InternalProvider } from "../../lib/types"
import { Provider } from "../../providers"
import { merge } from "../../lib/merge"
import { InternalUrl } from "../../lib/parse-url"

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

  const normalizedProvider: InternalProvider = Object.entries(
    provider
  ).reduce<InternalProvider>((acc, [key, value]) => {
    if (
      ["authorization", "token", "userinfo"].includes(key) &&
      typeof value === "string"
    ) {
      const url = new URL(value)
      ;(acc as any)[key] = {
        url: `${url.origin}${url.pathname}`,
        params: Object.fromEntries(url.searchParams ?? []),
      }
    } else {
      acc[key as keyof InternalProvider] = value
    }

    return acc
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter, @typescript-eslint/consistent-type-assertions
  }, {} as InternalProvider)

  // Checks only work on OAuth 2.x + OIDC providers
  if (
    provider.type === "oauth" &&
    !provider.version?.startsWith("1.") &&
    !provider.checks
  ) {
    ;(normalizedProvider as InternalProvider<"oauth">).checks = ["state"]
  }
  return normalizedProvider
}
