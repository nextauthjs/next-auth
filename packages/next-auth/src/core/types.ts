import type { Adapter, AdapterUser } from "../adapters"
import type {
  Provider,
  CredentialInput,
  ProviderType,
  EmailConfig,
  CredentialsConfig,
  OAuthConfig,
  AuthorizationEndpointHandler,
  TokenEndpointHandler,
  UserinfoEndpointHandler,
} from "../providers"
import type { TokenSetParameters } from "openid-client"
import type { JWT, JWTOptions } from "../jwt"
import type { LoggerInstance } from "../utils/logger"
import type { CookieSerializeOptions } from "cookie"

import type { NextApiRequest, NextApiResponse } from "next"

import type { InternalUrl } from "../utils/parse-url"

export type Awaitable<T> = T | PromiseLike<T>

export type { LoggerInstance }

/**
 * Configure your NextAuth instance
 *
 * [Documentation](https://next-auth.js.org/configuration/options#options)
 */
export interface AuthOptions {
  /**
   * An array of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   * * **Default value**: `[]`
   * * **Required**: *Yes*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#providers) | [Providers documentation](https://next-auth.js.org/configuration/providers)
   */
  providers: Provider[]
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   * If not specified, it falls back to `jwt.secret` or `NEXTAUTH_SECRET` from environment variables.
   * Otherwise, it will use a hash of all configuration options, including Client ID / Secrets for entropy.
   *
   * NOTE: The last behavior is extremely volatile, and will throw an error in production.
   * * **Default value**: `string` (SHA hash of the "options" object)
   * * **Required**: No - **but strongly recommended**!
   *
   * [Documentation](https://next-auth.js.org/configuration/options#secret)
   */
  secret?: string
  /**
   * Configure your session settings, such as determining whether to use JWT or a database,
   * setting the idle session expiration duration, or implementing write operation throttling for database usage.
   * * **Default value**: See the documentation page
   * * **Required**: No
   *
   * [Documentation](https://next-auth.js.org/configuration/options#session)
   */
  session?: Partial<SessionOptions>
  /**
   * JSON Web Tokens are enabled by default if you have not specified an adapter.
   * JSON Web Tokens are encrypted (JWE) by default. We recommend you keep this behaviour.
   * * **Default value**: See the documentation page
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#jwt)
   */
  jwt?: Partial<JWTOptions>
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   * * **Default value**: `{}`
   * * **Required**: *No*
   * @example
   *
   * ```js
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   *
   * [Documentation](https://next-auth.js.org/configuration/options#pages) | [Pages documentation](https://next-auth.js.org/configuration/pages)
   */
  pages?: Partial<PagesOptions>
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   * * **Default value**: See the Callbacks documentation
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#callbacks) | [Callbacks documentation](https://next-auth.js.org/configuration/callbacks)
   */
  callbacks?: Partial<CallbacksOptions>
  /**
   * Events are asynchronous functions that do not return a response, they are useful for audit logging.
   * You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.
   * The content of the message object varies depending on the flow
   * (e.g. OAuth or Email authentication flow, JWT or database sessions, etc),
   * but typically contains a user object and/or contents of the JSON Web Token
   * and other information relevant to the event.
   * * **Default value**: `{}`
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#events) | [Events documentation](https://next-auth.js.org/configuration/events)
   */
  events?: Partial<EventCallbacks>
  /**
   * You can use the adapter option to pass in your database adapter.
   *
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#adapter) |
   * [Adapters Overview](https://next-auth.js.org/adapters/overview)
   */
  adapter?: Adapter
  /**
   * Set debug to true to enable debug messages for authentication and database operations.
   * * **Default value**: `false`
   * * **Required**: *No*
   *
   * - ⚠ If you added a custom `logger`, this setting is ignored.
   *
   * [Documentation](https://next-auth.js.org/configuration/options#debug) | [Logger documentation](https://next-auth.js.org/configuration/options#logger)
   */
  debug?: boolean
  /**
   * Override any of the logger levels (`undefined` levels will use the built-in logger),
   * and intercept logs in NextAuth. You can use this option to send NextAuth logs to a third-party logging service.
   * * **Default value**: `console`
   * * **Required**: *No*
   *
   * @example
   *
   * ```js
   * // /pages/api/auth/[...nextauth].js
   * import log from "logging-service"
   * export default NextAuth({
   *   logger: {
   *     error(code, ...message) {
   *       log.error(code, message)
   *     },
   *     warn(code, ...message) {
   *       log.warn(code, message)
   *     },
   *     debug(code, ...message) {
   *       log.debug(code, message)
   *     }
   *   }
   * })
   * ```
   *
   * - ⚠ When set, the `debug` option is ignored
   *
   * [Documentation](https://next-auth.js.org/configuration/options#logger) |
   * [Debug documentation](https://next-auth.js.org/configuration/options#debug)
   */
  logger?: Partial<LoggerInstance>
  /**
   * Changes the theme of pages.
   * Set to `"light"` if you want to force pages to always be light.
   * Set to `"dark"` if you want to force pages to always be dark.
   * Set to `"auto"`, (or leave this option out)if you want the pages to follow the preferred system theme.
   * * **Default value**: `"auto"`
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#theme) | [Pages documentation]("https://next-auth.js.org/configuration/pages")
   */
  theme?: Theme
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   * * **Default value**: `true` for HTTPS and `false` for HTTP sites
   * * **Required**: No
   *
   * [Documentation](https://next-auth.js.org/configuration/options#usesecurecookies)
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   */
  useSecureCookies?: boolean
  /**
   * You can override the default cookie names and options for any of the cookies used by NextAuth.js.
   * You can specify one or more cookies with custom properties,
   * but if you specify custom options for a cookie you must provide all the options for that cookie.
   * If you use this feature, you will likely want to create conditional behavior
   * to support setting different cookies policies in development and production builds,
   * as you will be opting out of the built-in dynamic policy.
   * * **Default value**: `{}`
   * * **Required**: No
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * [Documentation](https://next-auth.js.org/configuration/options#cookies) | [Usage example](https://next-auth.js.org/configuration/options#example)
   */
  cookies?: Partial<CookiesOptions>
}

/**
 * Change the theme of the built-in pages.
 *
 * [Documentation](https://next-auth.js.org/configuration/options#theme) |
 * [Pages](https://next-auth.js.org/configuration/pages)
 */
export interface Theme {
  colorScheme?: "auto" | "dark" | "light"
  logo?: string
  brandColor?: string
  buttonText?: string
}

/**
 * Different tokens returned by OAuth Providers.
 * Some of them are available with different casing,
 * but they refer to the same value.
 */
export type TokenSet = TokenSetParameters

/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends Partial<TokenSet> {
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string
  /** id of the user this account belongs to. */
  userId?: string
  /** id of the provider used for this account */
  provider: string
  /** Provider's type for this account */
  type: ProviderType
}

/** The OAuth profile returned from your provider */
export interface Profile {
  sub?: string
  name?: string
  email?: string
  image?: string
}

/** [Documentation](https://next-auth.js.org/configuration/callbacks) */
export interface CallbacksOptions<P = Profile, A = Account> {
  /**
   * Use this callback to control if a user is allowed to sign in.
   * Returning true will continue the sign-in flow.
   * Throwing an error or returning a string will stop the flow, and redirect the user.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#sign-in-callback)
   */
  signIn: (params: {
    user: User | AdapterUser
    account: A | null
    /**
     * If OAuth provider is used, it contains the full
     * OAuth profile returned by your provider.
     */
    profile?: P
    /**
     * If Email provider is used, on the first call, it contains a
     * `verificationRequest: true` property to indicate it is being triggered in the verification request flow.
     * When the callback is invoked after a user has clicked on a sign in link,
     * this property will not be present. You can check for the `verificationRequest` property
     * to avoid sending emails to addresses or domains on a blocklist or to only explicitly generate them
     * for email address in an allow list.
     */
    email?: {
      verificationRequest?: boolean
    }
    /** If Credentials provider is used, it contains the user credentials */
    credentials?: Record<string, CredentialInput>
  }) => Awaitable<string | boolean>
  /**
   * This callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
   * By default only URLs on the same URL as the site are allowed,
   * you can use this callback to customise that behaviour.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#redirect-callback)
   */
  redirect: (params: {
    /** URL provided as callback URL by the client */
    url: string
    /** Default base URL of site (can be used as fallback) */
    baseUrl: string
  }) => Awaitable<string>
  /**
   * This callback is called whenever a session is checked.
   * (Eg.: invoking the `/api/session` endpoint, using `useSession` or `getSession`)
   *
   * ⚠ By default, only a subset (email, name, image)
   * of the token is returned for increased security.
   *
   * If you want to make something available you added to the token through the `jwt` callback,
   * you have to explicitly forward it here to make it available to the client.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#session-callback) |
   * [`jwt` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
   * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
   * [`getSession`](https://next-auth.js.org/getting-started/client#getsession) |
   *
   */
  session: (
    params:
      | {
          session: Session
          /** Available when {@link SessionOptions.strategy} is set to `"jwt"` */
          token: JWT
          /** Available when {@link SessionOptions.strategy} is set to `"database"`. */
          user: AdapterUser
        } & {
          /**
           * Available when using {@link SessionOptions.strategy} `"database"`, this is the data
           * sent from the client via the [`useSession().update`](https://next-auth.js.org/getting-started/client#update-session) method.
           *
           * ⚠ Note, you should validate this data before using it.
           */
          newSession: any
          trigger: "update"
        }
  ) => Awaitable<Session | DefaultSession>
  /**
   * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
   * or updated (i.e whenever a session is accessed in the client).
   * Its content is forwarded to the `session` callback,
   * where you can control what should be returned to the client.
   * Anything else will be kept from your front-end.
   *
   * The JWT is encrypted by default.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
   * [`session` callback](https://next-auth.js.org/configuration/callbacks#session-callback)
   */
  jwt: (
    // TODO: remove in `@auth/core` in favor of `trigger: "signUp"`
    params: {
      /**
       * When `trigger` is `"signIn"` or `"signUp"`, it will be a subset of {@link JWT},
       * `name`, `email` and `picture` will be included.
       *
       * Otherwise, it will be the full {@link JWT} for subsequent calls.
       */
      token: JWT
      /**
       * Either the result of the {@link OAuthConfig.profile} or the {@link CredentialsConfig.authorize} callback.
       * @note available when `trigger` is `"signIn"` or `"signUp"`.
       *
       * Resources:
       * - [Credentials Provider](https://next-auth.js.org/providers/credentials)
       * - [User database model](https://authjs.dev/reference/adapters#user)
       */
      user: User | AdapterUser
      /**
       * Contains information about the provider that was used to sign in.
       * Also includes {@link TokenSet}
       * @note available when `trigger` is `"signIn"` or `"signUp"`
       */
      account: A | null
      /**
       * The OAuth profile returned from your provider.
       * (In case of OIDC it will be the decoded ID Token or /userinfo response)
       * @note available when `trigger` is `"signIn"`.
       */
      profile?: P
      /**
       * Check why was the jwt callback invoked. Possible reasons are:
       * - user sign-in: First time the callback is invoked, `user`, `profile` and `account` will be present.
       * - user sign-up: a user is created for the first time in the database (when {@link SessionOptions.strategy} is set to `"database"`})
       * - update event: Triggered by the [`useSession().update`](https://next-auth.js.org/getting-started/client#update-session) method.
       * In case of the latter, `trigger` will be `undefined`.
       */
      trigger?: "signIn" | "signUp" | "update"
      /** @deprecated use `trigger === "signUp"` instead */
      isNewUser?: boolean
      /**
       * When using {@link SessionOptions.strategy} `"jwt"`, this is the data
       * sent from the client via the [`useSession().update`](https://next-auth.js.org/getting-started/client#update-session) method.
       *
       * ⚠ Note, you should validate this data before using it.
       */
      session?: any
    }
  ) => Awaitable<JWT>
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookiesOptions {
  sessionToken: CookieOption
  callbackUrl: CookieOption
  csrfToken: CookieOption
  pkceCodeVerifier: CookieOption
  state: CookieOption
  nonce: CookieOption
}

/**
 *  The various event callbacks you can register for from next-auth
 *
 * [Documentation](https://next-auth.js.org/configuration/events)
 */
export interface EventCallbacks {
  /**
   * If using a `credentials` type auth, the user is the raw response from your
   * credential provider.
   * For other providers, you'll get the User object from your adapter, the account,
   * and an indicator if the user was new to your Adapter.
   */
  signIn: (message: {
    user: User
    account: Account | null
    profile?: Profile
    isNewUser?: boolean
  }) => Awaitable<void>
  /**
   * The message object will contain one of these depending on
   * if you use JWT or database persisted sessions:
   * - `token`: The JWT token for this session.
   * - `session`: The session object from your adapter that is being ended.
   */
  signOut: (message: { session: Session; token: JWT }) => Awaitable<void>
  createUser: (message: { user: User }) => Awaitable<void>
  updateUser: (message: { user: User }) => Awaitable<void>
  linkAccount: (message: {
    user: User | AdapterUser
    account: Account
    profile: User | AdapterUser
  }) => Awaitable<void>
  /**
   * The message object will contain one of these depending on
   * if you use JWT or database persisted sessions:
   * - `token`: The JWT token for this session.
   * - `session`: The session object from your adapter.
   */
  session: (message: { session: Session; token: JWT }) => Awaitable<void>
}

export type EventType = keyof EventCallbacks

/** [Documentation](https://next-auth.js.org/configuration/pages) */
export interface PagesOptions {
  signIn: string
  signOut: string
  /** Error code passed in query string as ?error= */
  error: string
  verifyRequest: string
  /** If set, new users will be directed here on first sign in */
  newUser: string
}

export type ISODateString = string

export interface DefaultSession {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires: ISODateString
}

/**
 * Returned by `useSession`, `getSession`, returned by the `session` callback
 * and also the shape received as a prop on the `SessionProvider` React Context
 *
 * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
 * [`getSession`](https://next-auth.js.org/getting-started/client#getsession) |
 * [`SessionProvider`](https://next-auth.js.org/getting-started/client#sessionprovider) |
 * [`session` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback)
 */
export interface Session extends DefaultSession {}

export type SessionStrategy = "jwt" | "database"

/** [Documentation](https://next-auth.js.org/configuration/options#session) */
export interface SessionOptions {
  /**
   * Choose how you want to save the user session.
   * The default is `"jwt"`, an encrypted JWT (JWE) in the session cookie.
   *
   * If you use an `adapter` however, we default it to `"database"` instead.
   * You can still force a JWT session by explicitly defining `"jwt"`.
   *
   * When using `"database"`, the session cookie will only contain a `sessionToken` value,
   * which is used to look up the session in the database.
   *
   * [Documentation](https://next-auth.js.org/configuration/options#session) | [Adapter](https://next-auth.js.org/configuration/options#adapter) | [About JSON Web Tokens](https://next-auth.js.org/faq#json-web-tokens)
   */
  strategy: SessionStrategy
  /**
   * Relative time from now in seconds when to expire the session
   * @default 2592000 // 30 days
   */
  maxAge: number
  /**
   * How often the session should be updated in seconds.
   * If set to `0`, session is updated every time.
   * @default 86400 // 1 day
   */
  updateAge: number
  /**
   * Generate a custom session token for database-based sessions.
   * By default, a random UUID or string is generated depending on the Node.js version.
   * However, you can specify your own custom string (such as CUID) to be used.
   * @default `randomUUID` or `randomBytes.toHex` depending on the Node.js version
   */
  generateSessionToken: () => Awaitable<string>
}

export interface DefaultUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

/**
 * The shape of the returned object in the OAuth providers' `profile` callback,
 * available in the `jwt` and `session` callbacks,
 * or the second parameter of the `session` callback, when using a database.
 *
 * [`signIn` callback](https://next-auth.js.org/configuration/callbacks#sign-in-callback) |
 * [`session` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
 * [`jwt` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
 * [`profile` OAuth provider callback](https://next-auth.js.org/configuration/providers#using-a-custom-provider)
 */
export interface User extends DefaultUser {}

// Below are types that are only supposed be used by next-auth internally

/** @internal */
export interface OAuthConfigInternal<P>
  extends Omit<OAuthConfig<P>, "authorization" | "token" | "userinfo"> {
  authorization?: AuthorizationEndpointHandler
  token?: TokenEndpointHandler
  userinfo?: UserinfoEndpointHandler
}

/** @internal */
export type InternalProvider<T = ProviderType> = (T extends "oauth"
  ? OAuthConfigInternal<any>
  : T extends "email"
  ? EmailConfig
  : T extends "credentials"
  ? CredentialsConfig
  : never) & {
  signinUrl: string
  callbackUrl: string
}

export type AuthAction =
  | "providers"
  | "session"
  | "csrf"
  | "signin"
  | "signout"
  | "callback"
  | "verify-request"
  | "error"
  | "_log"

/** @internal */
export interface InternalOptions<
  TProviderType = ProviderType,
> {
  providers: InternalProvider[]
  /**
   * Parsed from `NEXTAUTH_URL` or `x-forwarded-host` and `x-forwarded-proto` if the host is trusted.
   * @default "http://localhost:3000/api/auth"
   */
  url: InternalUrl
  action: AuthAction
  provider: InternalProvider<TProviderType>
  csrfToken?: string
  csrfTokenVerified?: boolean
  secret: string
  theme: Theme
  debug: boolean
  logger: LoggerInstance
  session: Required<SessionOptions>
  pages: Partial<PagesOptions>
  jwt: JWTOptions
  events: Partial<EventCallbacks>
  adapter?: Adapter
  callbacks: CallbacksOptions
  cookies: CookiesOptions
  callbackUrl: string
}

/** @internal */
export interface NextAuthRequest extends NextApiRequest {
  options: InternalOptions
}

/** @internal */
export type NextAuthResponse<T = any> = NextApiResponse<T>

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type NextAuthApiHandler<Result = void, Response = any> = (
  req: NextAuthRequest,
  res: NextAuthResponse<Response>
) => Awaitable<Result>
