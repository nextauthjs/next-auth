import type { Client } from "oauth4webapi"
import type { Awaitable, Profile, TokenSet, User } from "../types.js"
import type { CommonProviderOptions } from "../providers/index.js"

// TODO:
type AuthorizationParameters = any
type CallbackParamsType = any
type IssuerMetadata = any
type OAuthCallbackChecks = any
type OpenIDCallbackChecks = any

export type { OAuthProviderType } from "./oauth-types.js"

export type OAuthChecks = OpenIDCallbackChecks | OAuthCallbackChecks

type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>

type UrlParams = Record<string, unknown>

type EndpointRequest<C, R, P> = (
  context: C & {
    /** Provider is passed for convenience, ans also contains the `callbackUrl`. */
    provider: OAuthConfigInternal<P> & {
      signinUrl: string
      callbackUrl: string
    }
  }
) => Awaitable<R>

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
}

/** Either an URL (containing all the parameters) or an object with more granular control. */
export type EndpointHandler<
  P extends UrlParams,
  C = any,
  R = any
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

export interface OAuthProviderButtonStyles {
  logo: string
  logoDark: string
  bg: string
  bgDark: string
  text: string
  textDark: string
}

/** TODO: */
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
   * Receives the profile object returned by the OAuth provider, and returns the user object.
   * This will be used to create the user in the database.
   * Defaults to: `id`, `email`, `name`, `image`
   *
   * [Documentation](https://authjs.dev/reference/adapters/models#user)
   */
  profile?: ProfileCallback<Profile>
  /**
   * The CSRF protection performed on the callback endpoint.
   * @default ["pkce"]
   *
   * [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients (PKCE)](https://www.rfc-editor.org/rfc/rfc7636.html#section-4) |
   * [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1) |
   * [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) |
   */
  checks?: Array<"pkce" | "state" | "none" | "nonce">
  clientId?: string
  clientSecret?: string
  client?: Partial<Client>
  style?: OAuthProviderButtonStyles
  /**
   * [Documentation](https://authjs.dev/reference/providers/oauth#allowdangerousemailaccountlinking-option)
   */
  allowDangerousEmailAccountLinking?: boolean
  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   *
   * @internal
   */
  options?: OAuthUserConfig<Profile>
}

/** TODO: */
export interface OIDCConfig<Profile>
  extends Omit<OAuth2Config<Profile>, "type"> {
  type: "oidc"
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
  OAuthEndpointType
> & {
  authorization?: { url: URL }
  token?: {
    url: URL
    request?: TokenEndpointHandler["request"]
    conform?: TokenEndpointHandler["conform"]
  }
  userinfo?: { url: URL; request?: UserinfoEndpointHandler["request"] }
} & Pick<Required<OAuthConfig<Profile>>, "clientId" | "checks" | "profile">

export type OAuthUserConfig<Profile> = Omit<
  Partial<OAuthConfig<Profile>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<Profile>, "clientId" | "clientSecret">>

export type OIDCUserConfig<Profile> = Omit<
  Partial<OIDCConfig<Profile>>,
  "options" | "type"
> &
  Required<Pick<OIDCConfig<Profile>, "clientId" | "clientSecret">>
