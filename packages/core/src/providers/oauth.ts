import type { Client, PrivateKey } from "oauth4webapi"
import type { CommonProviderOptions } from "../providers/index.js"
import type { Awaitable, Profile, TokenSet, User } from "../types.js"
import type { AuthConfig } from "../index.js"
import type { conformInternal, customFetch } from "../lib/symbols.js"

// TODO: fix types
type AuthorizationParameters = any
type CallbackParamsType = any
type IssuerMetadata = any
type OAuthCallbackChecks = any
type OpenIDCallbackChecks = any

export type { OAuthProviderId } from "./provider-types.js"

export type OAuthChecks = OpenIDCallbackChecks | OAuthCallbackChecks

type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>

type UrlParams = Record<string, unknown>

type EndpointRequest<C, R, P> = (
  context: C & {
    /** Provider is passed for convenience, and also contains the `callbackUrl`. */
    provider: OAuthConfigInternal<P> & {
      signinUrl: string
      callbackUrl: string
    }
  }
) => Awaitable<R> | void

/** Gives granular control of the request to the given endpoint */
interface AdvancedEndpointHandler<P extends UrlParams, C, R> {
  /** Endpoint URL. Can contain parameters. Optionally, you can use `params` */
  url?: string
  /** These will be prepended to the `url` */
  params?: P
  /**
   * Control the corresponding OAuth endpoint request completely.
   * Useful if your provider relies on some custom behaviour
   * or it diverges from the OAuth spec.
   *
   * - ⚠ **This is an advanced option.**
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   */
  request?: EndpointRequest<C, R, P>
  /** @internal */
  conform?: (response: Response) => Awaitable<Response | undefined>
  clientPrivateKey?: CryptoKey | PrivateKey
}

/**
 * Either an URL (containing all the parameters) or an object with more granular control.
 * @internal
 */
export type EndpointHandler<
  P extends UrlParams,
  C = any,
  R = any,
> = AdvancedEndpointHandler<P, C, R>

export type AuthorizationEndpointHandler =
  EndpointHandler<AuthorizationParameters>

export type TokenEndpointHandler = EndpointHandler<
  UrlParams,
  {
    /**
     * Parameters extracted from the request to the `/api/auth/callback/:providerId` endpoint.
     * Contains params like `state`.
     */
    params: CallbackParamsType
    /**
     * When using this custom flow, make sure to do all the necessary security checks.
     * This object contains parameters you have to match against the request to make sure it is valid.
     */
    checks: OAuthChecks
  },
  {
    tokens: TokenSet
  }
>

export type UserinfoEndpointHandler = EndpointHandler<
  UrlParams,
  { tokens: TokenSet },
  Profile
>

export type ProfileCallback<Profile> = (
  profile: Profile,
  tokens: TokenSet
) => Awaitable<User>

export type AccountCallback = (tokens: TokenSet) => TokenSet | undefined | void

export interface OAuthProviderButtonStyles {
  logo?: string
  /**
   * @deprecated
   */
  text?: string
  /**
   * @deprecated Please use 'brandColor' instead
   */
  bg?: string
  brandColor?: string
}

/** TODO: Document */
export interface OAuth2Config<Profile>
  extends CommonProviderOptions,
    PartialIssuer {
  /**
   * Identifies the provider when you want to sign in to
   * a specific provider.
   *
   * @example
   * ```ts
   * signIn('github') // "github" is the provider ID
   * ```
   */
  id: string
  /** The name of the provider. shown on the default sign in page. */
  name: string
  /**
   * OpenID Connect (OIDC) compliant providers can configure
   * this instead of `authorize`/`token`/`userinfo` options
   * without further configuration needed in most cases.
   * You can still use the `authorize`/`token`/`userinfo`
   * options for advanced control.
   *
   * [Authorization Server Metadata](https://datatracker.ietf.org/doc/html/rfc8414#section-3)
   */
  wellKnown?: string
  issuer?: string
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization?: string | AuthorizationEndpointHandler
  token?: string | TokenEndpointHandler
  userinfo?: string | UserinfoEndpointHandler
  type: "oauth"
  /**
   * Receives the full {@link Profile} returned by the OAuth provider, and returns a subset.
   * It is used to create the user in the database.
   *
   * Defaults to: `id`, `email`, `name`, `image`
   *
   * @see [Database Adapter: User model](https://authjs.dev/reference/core/adapters#user)
   */
  profile?: ProfileCallback<Profile>
  /**
   * Receives the full {@link TokenSet} returned by the OAuth provider, and returns a subset.
   * It is used to create the account associated with a user in the database.
   *
   * :::note
   * You need to adjust your database's [Account model](https://authjs.dev/reference/core/adapters#account) to match the returned properties.
   * Check out the documentation of your [database adapter](https://authjs.dev/reference/core/adapters) for more information.
   * :::
   *
   * Defaults to: `access_token`, `id_token`, `refresh_token`, `expires_at`, `scope`, `token_type`, `session_state`
   *
   * @example
   * ```ts
   * import GitHub from "@auth/core/providers/github"
   * // ...
   * GitHub({
   *   account(account) {
   *     // https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/refreshing-user-access-tokens#refreshing-a-user-access-token-with-a-refresh-token
   *     const refresh_token_expires_at =
   *       Math.floor(Date.now() / 1000) + Number(account.refresh_token_expires_in)
   *     return {
   *       access_token: account.access_token,
   *       expires_at: account.expires_at,
   *       refresh_token: account.refresh_token,
   *       refresh_token_expires_at
   *     }
   *   }
   * })
   * ```
   *
   * @see [Database Adapter: Account model](https://authjs.dev/reference/core/adapters#account)
   * @see https://openid.net/specs/openid-connect-core-1_0.html#TokenResponse
   * @see https://www.ietf.org/rfc/rfc6749.html#section-5.1
   */
  account?: AccountCallback
  /**
   * The CSRF protection performed on the callback endpoint.
   * @default ["pkce"]
   *
   * @note When `redirectProxyUrl` or {@link AuthConfig.redirectProxyUrl} is set,
   * `"state"` will be added to checks automatically.
   *
   * [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients (PKCE)](https://www.rfc-editor.org/rfc/rfc7636.html#section-4) |
   * [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1) |
   * [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) |
   */
  checks?: Array<"pkce" | "state" | "none">
  clientId?: string
  clientSecret?: string
  /**
   * Pass overrides to the underlying OAuth library.
   * See [`oauth4webapi` client](https://github.com/panva/oauth4webapi/blob/main/docs/interfaces/Client.md) for details.
   */
  client?: Partial<Client & { token_endpoint_auth_method: string }>
  style?: OAuthProviderButtonStyles
  /**
   * Normally, when you sign in with an OAuth provider and another account
   * with the same email address already exists,
   * the accounts are not linked automatically.
   *
   * Automatic account linking on sign in is not secure
   * between arbitrary providers and is disabled by default.
   * Learn more in our [Security FAQ](https://authjs.dev/concepts#security).
   *
   * However, it may be desirable to allow automatic account linking if you trust that the provider involved has securely verified the email address
   * associated with the account. Set `allowDangerousEmailAccountLinking: true`
   * to enable automatic account linking.
   */
  allowDangerousEmailAccountLinking?: boolean
  redirectProxyUrl?: AuthConfig["redirectProxyUrl"]
  /** @see {customFetch} */
  [customFetch]?: typeof fetch
  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   *
   * @internal
   */
  /** @see {conformInternal} */
  [conformInternal]?: true
  options?: OAuthUserConfig<Profile>
}

/**
 * Extension of the {@link OAuth2Config}.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html
 */
export interface OIDCConfig<Profile>
  extends Omit<OAuth2Config<Profile>, "type" | "checks"> {
  type: "oidc"
  checks?: Array<NonNullable<OAuth2Config<Profile>["checks"]>[number] | "nonce">
  /**
   * If set to `false`, the `userinfo_endpoint` will be fetched for the user data.
   * @note An `id_token` is still required to be returned during the authorization flow.
   */
  idToken?: boolean
}

export type OAuthConfig<Profile> = OIDCConfig<Profile> | OAuth2Config<Profile>

export type OAuthEndpointType = "authorization" | "token" | "userinfo"

/**
 * We parsed `authorization`, `token` and `userinfo`
 * to always contain a valid `URL`, with the params
 * @internal
 */
export type OAuthConfigInternal<Profile> = Omit<
  OAuthConfig<Profile>,
  OAuthEndpointType | "redirectProxyUrl"
> & {
  authorization?: { url: URL }
  token?: {
    url: URL
    request?: TokenEndpointHandler["request"]
    clientPrivateKey?: CryptoKey | PrivateKey
    /**
     * @internal
     * @deprecated
     */
    conform?: TokenEndpointHandler["conform"]
  }
  userinfo?: { url: URL; request?: UserinfoEndpointHandler["request"] }
  /**
   * Reconstructed from {@link OAuth2Config.redirectProxyUrl},
   * adding the callback action and provider id onto the URL.
   *
   * If defined, it is favoured over {@link OAuthConfigInternal.callbackUrl} in the authorization request.
   *
   * When {@link InternalOptions.isOnRedirectProxy} is set, the actual value is saved in the decoded `state.origin` parameter.
   *
   * @example `"https://auth.example.com/api/auth/callback/:provider"`
   *
   */
  redirectProxyUrl?: OAuth2Config<Profile>["redirectProxyUrl"]
} & Pick<
    Required<OAuthConfig<Profile>>,
    "clientId" | "checks" | "profile" | "account"
  >

export type OIDCConfigInternal<Profile> = OAuthConfigInternal<Profile> & {
  checks: OIDCConfig<Profile>["checks"]
  idToken: OIDCConfig<Profile>["idToken"]
}

export type OAuthUserConfig<Profile> = Omit<
  Partial<OAuthConfig<Profile>>,
  "options" | "type"
>

export type OIDCUserConfig<Profile> = Omit<
  Partial<OIDCConfig<Profile>>,
  "options" | "type"
>
