import { merge } from "../../utils/merge"

import type { InternalProvider } from "../types"
import type {
  OAuthConfigInternal,
  OAuthConfig,
  Provider,
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

  const providers = params.providers.map<InternalProvider>(
    ({ options: authOptions, ...rest }) => {
      if (rest.type === "oauth") {
        const normalizedOptions = normalizeOAuthOptions(rest)
        const normalizedauthOptions = normalizeOAuthOptions(authOptions, true)
        const id = normalizedauthOptions?.id ?? rest.id
        return merge(normalizedOptions, {
          ...normalizedauthOptions,
          signinUrl: `${url}/signin/${id}`,
          callbackUrl: `${url}/callback/${id}`,
        })
      }
      const id = (authOptions?.id as string) ?? rest.id
      return merge(rest, {
        ...authOptions,
        signinUrl: `${url}/signin/${id}`,
        callbackUrl: `${url}/callback/${id}`,
      })
    }
  )

  return {
    providers,
    provider: providers.find(({ id }) => id === providerId),
  }
}

/**
 * Transform OAuth options `authorization`, `token` and `profile` strings to `{ url: string; params: Record<string, string> }`
 */
function normalizeOAuthOptions(
  oauthOptions?: Partial<OAuthConfig<any>> | Record<string, unknown>,
  isauthOptions = false
) {
  if (!oauthOptions) return

  const normalized = Object.entries(oauthOptions).reduce<
    OAuthConfigInternal<Record<string, unknown>>
  >(
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
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as any
  )

  if (!isauthOptions && !normalized.version?.startsWith("1.")) {
    // If provider has as an "openid-configuration" well-known endpoint
    // or an "openid" scope request, it will also likely be able to receive an `id_token`
    // Only do this if this function is not called with user options to avoid overriding in later stage.
    normalized.idToken = Boolean(
      normalized.idToken ??
        normalized.wellKnown?.includes("openid-configuration") ??
        normalized.authorization?.params?.scope?.includes("openid")
    )

    if (!normalized.checks) normalized.checks = ["state"]
  }
  return normalized
}
