import type { CommonProviderOptions } from "../providers"
import type { Profile, TokenSet, User, Awaitable } from ".."

import type {
  AuthorizationParameters,
  CallbackParamsType,
  Issuer,
  ClientMetadata,
  IssuerMetadata,
  OAuthCallbackChecks,
  OpenIDCallbackChecks,
  HttpOptions,
} from "openid-client"
import type { JWK } from "jose"

type Client = InstanceType<Issuer["Client"]>

export type { OAuthProviderType } from "./oauth-types"

type ChecksType = "pkce" | "state" | "none" | "nonce"

export type OAuthChecks = OpenIDCallbackChecks | OAuthCallbackChecks

type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>

type UrlParams = Record<string, unknown>

type EndpointRequest<C, R, P> = (
  context: C & {
    /** `openid-client` Client */
    client: Client
    /** Provider is passed for convenience, ans also contains the `callbackUrl`. */
    provider: OAuthConfig<P> & {
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

export interface OAuthProviderButtonStyles {
  logo: string
  logoDark: string
  bg: string
  bgDark: string
  text: string
  textDark: string
}

export interface OAuthConfig<P> extends CommonProviderOptions, PartialIssuer {
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
  jwks_endpoint?: string
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization?: string | AuthorizationEndpointHandler
  token?: string | TokenEndpointHandler
  userinfo?: string | UserinfoEndpointHandler
  type: "oauth"
  version?: string
  profile: (profile: P, tokens: TokenSet) => Awaitable<User>
  checks?: ChecksType | ChecksType[]
  client?: Partial<ClientMetadata>
  jwks?: { keys: JWK[] }
  clientId?: string
  clientSecret?: string
  /**
   * If set to `true`, the user information will be extracted
   * from the `id_token` claims, instead of
   * making a request to the `userinfo` endpoint.
   *
   * `id_token` is usually present in OpenID Connect (OIDC) compliant providers.
   *
   * [`id_token` explanation](https://www.oauth.com/oauth2-servers/openid-connect/id-tokens)
   */
  idToken?: boolean
  // TODO: only allow for BattleNet
  region?: string
  // TODO: only allow for some
  issuer?: string
  /** Read more at: https://github.com/panva/node-openid-client/tree/main/docs#customizing-http-requests */
  httpOptions?: HttpOptions

  style?: OAuthProviderButtonStyles

  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   */
  options?: OAuthUserConfig<P>

  // These are kept around for backwards compatibility with OAuth 1.x
  accessTokenUrl?: string
  requestTokenUrl?: string
  profileUrl?: string
  encoding?: string
  allowDangerousEmailAccountLinking?: boolean
}

export type OAuthUserConfig<P> = Omit<
  Partial<OAuthConfig<P>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<P>, "clientId" | "clientSecret">>

export type OAuthProvider = (
  options: Partial<OAuthConfig<any>>
) => OAuthConfig<any>
