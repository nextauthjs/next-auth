import { InternalProvider } from "src/lib/types"
import { Provider } from "../../providers"
import { merge } from "../../lib/merge"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
  providers: Provider[]
  base: string
  providerId?: string
}): {
  providers: InternalProvider[]
  provider?: InternalProvider
} {
  const { base, providerId } = params

  const providers = params.providers.map(({ options, ...rest }) => {
    const defaultOptions = normalizeProvider(rest as Provider)
    const userOptions = normalizeProvider(options as Provider)

    return merge(defaultOptions, {
      ...userOptions,
      signinUrl: `${base}/signin/${userOptions?.id ?? rest.id}`,
      callbackUrl: `${base}/callback/${userOptions?.id ?? rest.id}`,
    })
  })

  const provider = providers.find(({ id }) => id === providerId)

  return { providers, provider }
}

function normalizeProvider(provider?: Provider) {
  if (!provider) return

  const normalizedProvider: any = Object.entries(provider).reduce(
    (acc, [key, value]) => {
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
    },
    {}
  )

  // Checks only work on OAuth 2.x + OIDC providers
  if (
    provider.type === "oauth" &&
    !provider.version?.startsWith("1.") &&
    !provider.checks
  ) {
    normalizedProvider.checks = ["state"]
  }
  return normalizedProvider as InternalProvider
}
