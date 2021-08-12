import { Profile, TokenSet, User } from "."
import { Awaitable, NextApiRequest } from "./internals/utils"
import { Options as SMTPConnectionOptions } from "nodemailer/lib/smtp-connection"
import {
  AuthorizationParameters,
  CallbackParamsType,
  Client,
  Issuer,
  IssuerMetadata,
  OAuthCallbackChecks,
  OpenIDCallbackChecks,
} from "openid-client"

export type ProviderType = "oauth" | "email" | "credentials"

export interface CommonProviderOptions {
  id: string
  name: string
  type: ProviderType
}

/**
 * OAuth Provider
 */

type ChecksType = "pkce" | "state" | "both" | "none"

export type OAuthChecks = OpenIDCallbackChecks | OAuthCallbackChecks

type PartialIssuer = Partial<Pick<IssuerMetadata, "jwks_endpoint" | "issuer">>

type UrlParams = Record<string, unknown>

type EndpointRequest<C, R> = (
  context: C & {
    /** `openid-client` Client */
    client: Client
    /** Provider is passed for convenience, ans also contains the `callbackUrl`. */
    provider: OAuthConfig & {
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
  request?: EndpointRequest<C, R>
}

/** Either an URL (containing all the parameters) or an object with more granular control. */
type EndpointHandler<P extends UrlParams, C = any, R = any> =
  | string
  | AdvancedEndpointHandler<P, C, R>

export interface OAuthConfig<P extends Record<string, unknown> = Profile>
  extends CommonProviderOptions,
    PartialIssuer {
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
  authorization: EndpointHandler<AuthorizationParameters>
  /**
   * Endpoint that returns OAuth 2/OIDC tokens and information about them.
   * This includes `access_token`, `id_token`, `refresh_token`, etc.
   *
   * [Token endpoint](https://datatracker.ietf.org/doc/html/rfc6749#section-3.2)
   */
  token: EndpointHandler<
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
  version: string
  accessTokenUrl?: string
  requestTokenUrl?: string
  profile(profile: P, tokens: TokenSet): Awaitable<User & { id: string }>
  checks?: ChecksType | ChecksType[]
  clientId: string
  clientSecret:
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
  options?: Omit<OAuthConfig<P>, "options">
}

export type OAuthProviderType =
  | "Apple"
  | "Atlassian"
  | "Auth0"
  | "AzureAD"
  | "AzureADB2C"
  | "BattleNet"
  | "Box"
  | "Bungie"
  | "Cognito"
  | "Coinbase"
  | "Discord"
  | "Dropbox"
  | "EVEOnline"
  | "Facebook"
  | "FACEIT"
  | "FortyTwo"
  | "Foursquare"
  | "Freshbooks"
  | "FusionAuth"
  | "GitHub"
  | "GitLab"
  | "Google"
  | "IdentityServer4"
  | "Instagram"
  | "Kakao"
  | "LINE"
  | "LinkedIn"
  | "Mailchimp"
  | "MailRu"
  | "Medium"
  | "Naver"
  | "Netlify"
  | "Okta"
  | "OneLogin"
  | "Osso"
  | "Reddit"
  | "Salesforce"
  | "Slack"
  | "Spotify"
  | "Strava"
  | "Twitch"
  | "Twitter"
  | "VK"
  | "WordPress"
  | "WorkOS"
  | "Yandex"
  | "Zoho"
  | "Zoom"

export type OAuthProvider = (options: Partial<OAuthConfig>) => OAuthConfig

/**
 * Credentials Provider
 */

interface CredentialInput {
  label?: string
  type?: string
  value?: string
  placeholder?: string
}

export type Credentials = Record<string, CredentialInput>

interface CredentialsConfig<C extends Credentials = {}>
  extends CommonProviderOptions {
  type: "credentials"
  credentials: C
  authorize(
    credentials: Record<keyof C, string>,
    req: NextApiRequest
  ): Awaitable<User | null>
}

export type CredentialsProvider = <C extends Record<string, CredentialInput>>(
  options: Partial<CredentialsConfig<C>>
) => CredentialsConfig<C>

export type CredentialsProviderType = "Credentials"

export type SendVerificationRequest = (params: {
  identifier: string
  url: string
  baseUrl: string
  token: string
  provider: EmailConfig
}) => Awaitable<void>

export interface EmailConfig extends CommonProviderOptions {
  type: "email"
  // TODO: Make use of https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
  server: string | SMTPConnectionOptions
  /** @default "NextAuth <no-reply@example.com>" */
  from?: string
  /**
   * How long until the e-mail can be used to log the user in,
   * in seconds. Defaults to 1 day
   * @default 86400
   */
  maxAge?: number
  sendVerificationRequest: SendVerificationRequest
}

export type EmailProvider = (options: Partial<EmailConfig>) => EmailConfig

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = "Email"

export type Provider = OAuthConfig | EmailConfig | CredentialsConfig

export type BuiltInProviders = Record<OAuthProviderType, OAuthProvider> &
  Record<CredentialsProviderType, CredentialsProvider> &
  Record<EmailProviderType, EmailProvider>

export type AppProviders = Array<
  Provider | ReturnType<BuiltInProviders[keyof BuiltInProviders]>
>

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string
  callbackUrl: string
}

declare const Providers: BuiltInProviders

export default Providers
