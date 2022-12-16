import type { Client } from "oauth4webapi"
import type { Awaitable, Profile, TokenSet, User } from "../index.js"
import type { CommonProviderOptions } from "../providers/index.js"

// TODO:
type AuthorizationParameters = any
type CallbackParamsType = any
type IssuerMetadata = any
type OAuthCallbackChecks = any
type OpenIDCallbackChecks = any

export type { OAuthProviderType } from "./oauth-types.js"

type ChecksType = "pkce" | "state" | "none" | "nonce"

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
     * Thist object contains parameters you have to match against the request to make sure it is valid.
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

export type ProfileCallback<P> = (
  profile: P,
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

export interface OAuth2Config<P> extends CommonProviderOptions, PartialIssuer {
  /**
   * Identifies the provider when you want to sign in to
   * a specific provider.
   *
   * @example
   * ```js
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
   * [Documentation](https://next-auth.js.org/adapters/models#user)
   */
  profile?: ProfileCallback<P>
  /**
   * The CSRF protection performed on the callback endpoint.
   * Defaults to `["pkce"]` if undefined.
   *
   * [RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients (PKCE)](https://www.rfc-editor.org/rfc/rfc7636.html#section-4) |
   * [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-4.1.1) |
   * [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) |
   */
  checks?: ChecksType[]
  clientId?: string
  clientSecret?: string
  client?: Partial<Client>
  style?: OAuthProviderButtonStyles
  /**
   * [Documentation](https://next-auth.js.org/configuration/providers/oauth#allowdangerousemailaccountlinking-option)
   */
  allowDangerousEmailAccountLinking?: boolean
  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   *
   * @internal
   */
  options?: OAuthUserConfig<P>
}

export interface OIDCConfig<P> extends Omit<OAuth2Config<P>, "type"> {
  type: "oidc"
}

export type OAuthConfig<P> = OIDCConfig<P> | OAuth2Config<P>

export type OAuthEndpointType = "authorization" | "token" | "userinfo"

/**
 * We parsesd `authorization`, `token` and `userinfo`
 * to always contain a valid `URL`, with the params
 */
export type OAuthConfigInternal<P> = Omit<
  OAuthConfig<P>,
  OAuthEndpointType | "clientId" | "checks" | "profile"
> & {
  clientId: string
  authorization?: { url: URL }
  token?: { url: URL; request?: TokenEndpointHandler["request"] }
  userinfo?: { url: URL; request?: UserinfoEndpointHandler["request"] }
  checks: ChecksType[]
  profile: ProfileCallback<P>
}

export type OAuthUserConfig<P> = Omit<
  Partial<OAuthConfig<P>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<P>, "clientId" | "clientSecret">>

export type OAuthProvider = (
  options: Partial<OAuthConfig<any>>
) => OAuthConfig<any>
