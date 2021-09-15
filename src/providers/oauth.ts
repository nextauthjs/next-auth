import { CommonProviderOptions } from "../providers"
import { Profile, TokenSet, User, Awaitable } from ".."

import {
  AuthorizationParameters,
  CallbackParamsType,
  Client,
  IssuerMetadata,
  OAuthCallbackChecks,
  OpenIDCallbackChecks,
} from "openid-client"

export type { OAuthProviderType } from "./oauth-types"

type ChecksType = "pkce" | "state" | "both" | "none"

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
type EndpointHandler<P extends UrlParams, C = any, R = any> =
  | string
  | AdvancedEndpointHandler<P, C, R>

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
  /**
   * The login process will be initiated by sending the user to this URL.
   *
   * [Authorization endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.1)
   */
  authorization?: EndpointHandler<AuthorizationParameters>
  /**
   * Endpoint that returns OAuth 2/OIDC tokens and information about them.
   * This includes `access_token`, `id_token`, `refresh_token`, etc.
   *
   * [Token endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.2)
   */
  token?: EndpointHandler<
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
    { tokens: TokenSet }
  >
  /**
   * When using an OAuth 2 provider, the user information must be requested
   * through an additional request from the userinfo endpoint.
   *
   * [Userinfo endpoint](https://www.oauth.com/oauth2-servers/signing-in-with-google/verifying-the-user-info)
   */
  userinfo?: EndpointHandler<UrlParams, { tokens: TokenSet }, Profile>
  type: "oauth"
  version?: string
  accessTokenUrl?: string
  requestTokenUrl?: string
  profile?: (profile: P, tokens: TokenSet) => Awaitable<User & { id: string }>
  checks?: ChecksType | ChecksType[]
  clientId?: string
  clientSecret?:
    | string
    // TODO: only allow for Apple
    | Record<"appleId" | "teamId" | "privateKey" | "keyId", string>
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
  // TODO: only allow for Azure Active Directory B2C and FusionAuth
  tenantId?: string
  /**
   * The options provided by the user.
   * We will perform a deep-merge of these values
   * with the default configuration.
   */
  options?: OAuthUserConfig<P>
}

export type OAuthUserConfig<P> = Omit<
  Partial<OAuthConfig<P>>,
  "options" | "type"
> &
  Required<Pick<OAuthConfig<P>, "clientId" | "clientSecret">>

export type OAuthProvider = (
  options: Partial<OAuthConfig<any>>
) => OAuthConfig<any>
