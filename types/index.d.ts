// Minimum TypeScript Version: 3.6

/// <reference types="node" />

import { ConnectionOptions } from "typeorm"
import { Adapter } from "./adapters"
import { JWTOptions, JWT } from "./jwt"
import { AppProviders } from "./providers"
import {
  Awaitable,
  NextApiRequest,
  NextApiResponse,
  NextApiHandler,
} from "./internals/utils"

/**
 * Configure your NextAuth instance
 *
 * [Documentation](https://next-auth.js.org/configuration/options#options)
 */
export interface NextAuthOptions {
  /**
   * An array of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   * * **Default value**: `[]`
   * * **Required**: *Yes*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#providers) | [Providers documentation](https://next-auth.js.org/configuration/providers)
   */
  providers: AppProviders
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   * If not specified is uses a hash of all configuration options, including Client ID / Secrets for entropy.
   * The default behavior is volatile, and **it is strongly recommended** you explicitly specify a value
   * to avoid invalidating end user sessions when configuration changes are deployed.
   * * **Default value**: `string` (SHA hash of the "options" object)
   * * **Required**: No - **but strongly recommended**!
   *
   * [Documentation](https://next-auth.js.org/configuration/options#secret)
   */
  secret?: string
  /**
   * Configure your session like if you want to use JWT or a database,
   * how long until an idle session expires, or to throttle write operations in case you are using a database.
   * * **Default value**: See the documentation page
   * * **Required**: No
   *
   * [Documentation](https://next-auth.js.org/configuration/options#session)
   */
  session?: SessionOptions
  /**
   * JSON Web Tokens can be used for session tokens if enabled with the `session: { jwt: true }` option.
   * JSON Web Tokens are enabled by default if you have not specified a database.
   * By default JSON Web Tokens are signed (JWS) but not encrypted (JWE),
   * as JWT encryption adds additional overhead and comes with some caveats.
   * You can enable encryption by setting `encryption: true`.
   * * **Default value**: See the documentation page
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#jwt)
   */
  jwt?: JWTOptions
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
   *     newUser: null
   *   }
   * ```
   *
   * [Documentation](https://next-auth.js.org/configuration/options#pages) | [Pages documentation](https://next-auth.js.org/configuration/pages)
   */
  pages?: PagesOptions
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   * * **Default value**: See the Callbacks documentation
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#callbacks) | [Callbacks documentation](https://next-auth.js.org/configuration/callbacks)
   */
  callbacks?: CallbacksOptions
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
  events?: Partial<JWTEventCallbacks | SessionEventCallbacks>
  /**
   * You can use the adapter option to pass in your database adapter.
   *
   * * **Required**: *No*
   *
   * [Documentation](https://next-auth.js.org/configuration/options#adapter) |
   * [Community adapters](https://github.com/nextauthjs/adapters)
   */
  adapter?: ReturnType<Adapter>
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
  logger?: LoggerInstance
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
  cookies?: CookiesOptions
}

/**
 * Change the theme of the built-in pages.
 *
 * [Documentation](https://next-auth.js.org/configuration/options#theme) |
 * [Pages](https://next-auth.js.org/configuration/pages)
 */
export type Theme = "auto" | "dark" | "light"

/**
 * Override any of the methods, and the rest will use the default logger.
 *
 * [Documentation](https://next-auth.js.org/configuration/options#logger)
 */
export interface LoggerInstance {
  warn(code: string, ...message: unknown[]): void
  error(code: string, ...message: unknown[]): void
  debug(code: string, ...message: unknown[]): void
}

/**
 * Different tokens returned by OAuth Providers.
 * Some of them are available with different casing,
 * but they refer to the same value.
 */
export interface TokenSet {
  accessToken: string
  /** Kept for historical reasons, check out `expires_in` */
  accessTokenExpires: null
  idToken?: string
  refreshToken?: string
  access_token: string
  expires_in?: number | null
  refresh_token?: string
  id_token?: string
}

/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends TokenSet, Record<string, unknown> {
  id: string
  provider: string
  type: string
}

export interface DefaultProfile {
  sub?: string
  name?: string
  email?: string
  image?: string
}

/** The OAuth profile returned from your provider */
export interface Profile extends Record<string, unknown>, DefaultProfile {}

/** [Documentation](https://next-auth.js.org/configuration/callbacks) */
export interface CallbacksOptions<
  P extends Record<string, unknown> = Profile,
  A extends Record<string, unknown> = Account
> {
  /**
   * Use this callback to control if a user is allowed to sign in.
   * Returning true will continue the sign-in flow.
   * Throwing an error or returning a string will stop the flow, and redirect the user.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#sign-in-callback)
   */
  signIn?(user: User, account: A, profile: P): Awaitable<string | boolean>
  /**
   * This callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
   * By default only URLs on the same URL as the site are allowed,
   * you can use this callback to customise that behaviour.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#redirect-callback)
   */
  redirect?(url: string, baseUrl: string): Awaitable<string>
  /**
   * This callback is called whenever a session is checked.
   * (Eg.: invoking the `/api/session` endpoint, using `useSession` or `getSession`)
   *
   * - ⚠ By default, only a subset of the token is returned for increased security.
   * If you want to make something available you added to the token through the `jwt` callback,
   * you have to explicitely forward it here to make it available to the client.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#session-callback) |
   * [`jwt` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
   * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
   * [`getSession`](https://next-auth.js.org/getting-started/client#getsession) |
   *
   */
  session?(session: Session, userOrToken: JWT | User): Awaitable<Session>
  /**
   * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
   * or updated (i.e whenever a session is accessed in the client).
   * Its content is forwarded to the `session` callback,
   * where you can control what should be returned to the client.
   * Anything else will be kept from your front-end.
   *
   * - ⚠ By default the JWT is signed, but not encrypted.
   *
   * [Documentation](https://next-auth.js.org/configuration/callbacks#jwt-callback) |
   * [`session` callback](https://next-auth.js.org/configuration/callbacks#session-callback)
   */
  jwt?(
    token: JWT,
    user?: User,
    account?: A,
    profile?: P,
    isNewUser?: boolean
  ): Awaitable<JWT>
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookieOption {
  name: string
  options: {
    httpOnly: boolean
    sameSite: true | "strict" | "lax" | "none"
    path?: string
    secure: boolean
    maxAge?: number
    domain?: string
  }
}

/** [Documentation](https://next-auth.js.org/configuration/options#cookies) */
export interface CookiesOptions {
  sessionToken?: CookieOption
  callbackUrl?: CookieOption
  csrfToken?: CookieOption
  pkceCodeVerifier?: CookieOption
}

/** [Documentation](https://next-auth.js.org/configuration/events) */
export type EventCallback<MessageType = unknown> = (
  message: MessageType
) => Promise<void>

/**
 * If using a `credentials` type auth, the user is the raw response from your
 * credential provider.
 * For other providers, you'll get the User object from your adapter, the account,
 * and an indicator if the user was new to your Adapter.
 */
export interface SignInEventMessage {
  user: User
  account: Account
  isNewUser?: boolean
}

export interface LinkAccountEventMessage {
  user: User
  providerAccount: Record<string, unknown>
}

/**
 * The various event callbacks you can register for from next-auth
 */
export interface CommonEventCallbacks {
  signIn: EventCallback<SignInEventMessage>
  createUser: EventCallback<User>
  updateUser: EventCallback<User>
  linkAccount: EventCallback<LinkAccountEventMessage>
  error: EventCallback
}
/**
 * The event callbacks will take this form if you are using JWTs:
 * signOut will receive the JWT and session will receive the session and JWT.
 */
export interface JWTEventCallbacks extends CommonEventCallbacks {
  signOut: EventCallback<JWT>
  session: EventCallback<{
    session: Session
    jwt: JWT
  }>
}
/**
 * The event callbacks will take this form if you are using Sessions
 * and not using JWTs:
 * signOut will receive the underlying DB adapter's session object, and session
 * will receive the NextAuth client session with extra data.
 */
export interface SessionEventCallbacks extends CommonEventCallbacks {
  signOut: EventCallback<Session | null>
  session: EventCallback<{ session: Session }>
}
export type EventCallbacks = JWTEventCallbacks | SessionEventCallbacks

export type EventType = keyof EventCallbacks

/** [Documentation](https://next-auth.js.org/configuration/pages) */
export interface PagesOptions {
  signIn?: string
  signOut?: string
  /** Error code passed in query string as ?error= */
  error?: string
  verifyRequest?: string
  /** If set, new users will be directed here on first sign in */
  newUser?: string
}

export interface DefaultSession extends Record<string, unknown> {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  expires?: string
}

/**
 * Returned by `useSession`, `getSession`, returned by the `session` callback
 * and also the shape received as a prop on the `Provider` React Context
 *
 * [`useSession`](https://next-auth.js.org/getting-started/client#usesession) |
 * [`getSession`](https://next-auth.js.org/getting-started/client#getsession) |
 * [`Provider`](https://next-auth.js.org/getting-started/client#provider) |
 * [`session` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback)
 */
export interface Session extends Record<string, unknown>, DefaultSession {}

/** [Documentation](https://next-auth.js.org/configuration/options#session) */
export interface SessionOptions {
  jwt?: boolean
  maxAge?: number
  updateAge?: number
}

export interface DefaultUser {
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
export interface User extends Record<string, unknown>, DefaultUser {}

declare function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
): ReturnType<NextApiHandler>

declare function NextAuth(options: NextAuthOptions): ReturnType<NextApiHandler>

export default NextAuth
