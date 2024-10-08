import { merge } from "./merge.js"

import type {
  AccountCallback,
  OAuthConfig,
  OAuthConfigInternal,
  OAuthEndpointType,
  OAuthUserConfig,
  ProfileCallback,
} from "../../providers/index.js"
import type { InternalProvider, Profile } from "../../types.js"
import { type AuthConfig } from "../../index.js"
import { customFetch } from "../utils/custom-fetch.js"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
  url: URL
  providerId?: string
  config: AuthConfig
}): {
  providers: InternalProvider[]
  provider?: InternalProvider
} {
  const { providerId, config } = params
  const url = new URL(config.basePath ?? "/auth", params.url.origin)

  const providers = config.providers.map((p) => {
    const provider = typeof p === "function" ? p() : p
    const { options: userOptions, ...defaults } = provider

    const id = (userOptions?.id ?? defaults.id) as string
    // TODO: Support if properties have different types, e.g. authorization: string or object
    const merged = merge(defaults, userOptions, {
      signinUrl: `${url}/signin/${id}`,
      callbackUrl: `${url}/callback/${id}`,
    })

    if (provider.type === "oauth" || provider.type === "oidc") {
      merged.redirectProxyUrl ??= config.redirectProxyUrl
      const normalized = normalizeOAuth(merged) as InternalProvider<
        "oauth" | "oidc"
      >
      // @ts-expect-error Symbols don't get merged by the `merge` function
      // so we need to do it manually.
      normalized[customFetch] ??= userOptions?.[customFetch]
      return normalized
    }

    return merged as InternalProvider
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
): OAuthConfigInternal<any> | object {
  if (c.issuer) c.wellKnown ??= `${c.issuer}/.well-known/openid-configuration`

  const authorization = normalizeEndpoint(c.authorization, c.issuer)
  if (authorization && !authorization.url?.searchParams.has("scope")) {
    authorization.url.searchParams.set("scope", "openid profile email")
  }

  const token = normalizeEndpoint(c.token, c.issuer)

  const userinfo = normalizeEndpoint(c.userinfo, c.issuer)

  const checks = c.checks ?? ["pkce"]
  if (c.redirectProxyUrl) {
    if (!checks.includes("state")) checks.push("state")
    c.redirectProxyUrl = `${c.redirectProxyUrl}/callback/${c.id}`
  }

  return {
    ...c,
    authorization,
    token,
    checks,
    userinfo,
    profile: c.profile ?? defaultProfile,
    account: c.account ?? defaultAccount,
  }
}

/**
 * Returns basic user profile from the userinfo response/`id_token` claims.
 * The returned `id` will become the `account.providerAccountId`. `user.id`
 * and `account.id` are auto-generated UUID's.
 *
 * The result if this function is used to create the `User` in the database.
 * @see https://authjs.dev/reference/core/adapters#user
 * @see https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * @see https://openid.net/specs/openid-connect-core-1_0.html#
 */
const defaultProfile: ProfileCallback<Profile> = (profile) => {
  return stripUndefined({
    id: profile.sub ?? profile.id ?? crypto.randomUUID(),
    name: profile.name ?? profile.nickname ?? profile.preferred_username,
    email: profile.email,
    image: profile.picture,
  })
}

/**
 * Returns basic OAuth/OIDC values from the token response.
 * @see https://www.ietf.org/rfc/rfc6749.html#section-5.1
 * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
 * @see https://authjs.dev/reference/core/adapters#account
 */
const defaultAccount: AccountCallback = (account) => {
  return stripUndefined({
    access_token: account.access_token,
    id_token: account.id_token,
    refresh_token: account.refresh_token,
    expires_at: account.expires_at,
    scope: account.scope,
    token_type: account.token_type,
    session_state: account.session_state,
  })
}

function stripUndefined<T extends object>(o: T): T {
  const result = {} as any
  for (const [k, v] of Object.entries(o)) {
    if (v !== undefined) result[k] = v
  }
  return result as T
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
      if (key === "claims") {
        value = JSON.stringify(value)
      }
      url.searchParams.set(key, String(value))
    }
  }
  return {
    url,
    request: e?.request,
    conform: e?.conform,
    ...(e?.clientPrivateKey ? { clientPrivateKey: e?.clientPrivateKey } : null),
  }
}

export function isOIDCProvider(
  provider: InternalProvider<"oidc" | "oauth">
): provider is InternalProvider<"oidc"> {
  return provider.type === "oidc"
}

export function isOAuth2Provider(
  provider: InternalProvider<"oidc" | "oauth">
): provider is InternalProvider<"oauth"> {
  return provider.type === "oauth"
}

/** Either OAuth 2 or OIDC */
export function isOAuthProvider(
  provider: InternalProvider<any>
): provider is InternalProvider<"oauth" | "oidc"> {
  return provider.type === "oauth" || provider.type === "oidc"
}
