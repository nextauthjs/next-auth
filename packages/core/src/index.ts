/**
 *
 * :::warning Experimental
 * `@auth/core` is under active development.
 * :::
 *
 * This is the main entry point to the Auth.js library.
 *
 * Based on the {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Request}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} Web standard APIs.
 * Primarily used to implement [framework](https://authjs.dev/getting-started/integrations)-specific packages,
 * but it can also be used directly.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {...})
 *
 * console.log(response instanceof Response) // true
 * ```
 *
 * ## Resources
 *
 * - [Getting started](https://authjs.dev/getting-started)
 * - [Guides](https://authjs.dev/guides)
 *
 * @module @auth/core
 */

import { assertConfig } from "./lib/utils/assert.js"
import {
  AuthError,
  CredentialsSignin,
  ErrorPageLoop,
  isClientError,
} from "./errors.js"
import { AuthInternal, raw, skipCSRFCheck } from "./lib/index.js"
import { setEnvDefaults, createActionURL } from "./lib/utils/env.js"
import renderPage from "./lib/pages/index.js"
import { logger, setLogger, type LoggerInstance } from "./lib/utils/logger.js"
import { toInternalRequest, toResponse } from "./lib/utils/web.js"

import type { Adapter, AdapterSession, AdapterUser } from "./adapters.js"
import type {
  Account,
  AuthAction,
  Awaitable,
  CookiesOptions,
  DefaultSession,
  PagesOptions,
  Profile,
  ResponseInternal,
  Session,
  Theme,
  User,
} from "./types.js"
import type { CredentialInput, Provider } from "./providers/index.js"
import { JWT, JWTOptions } from "./jwt.js"
import { isAuthAction } from "./lib/utils/actions.js"

export { skipCSRFCheck, raw, setEnvDefaults, createActionURL, isAuthAction }

export async function Auth(
  request: Request,
  config: AuthConfig & { raw: typeof raw }
): Promise<ResponseInternal>

export async function Auth(
  request: Request,
  config: Omit<AuthConfig, "raw">
): Promise<Response>

/**
 * Core functionality provided by Auth.js.
 *
 * Receives a standard {@link Request} and returns a {@link Response}.
 *
 * @example
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {
 *   providers: [Google],
 *   secret: "...",
 *   trustHost: true,
 * })
 *```
 * @see [Documentation](https://authjs.dev)
 */
export async function Auth(
  request: Request,
  config: AuthConfig
): Promise<Response | ResponseInternal> {
  setLogger(config.logger, config.debug)

  const internalRequest = await toInternalRequest(request, config)
  // There was an error parsing the request
  if (!internalRequest) return Response.json(`Bad request.`, { status: 400 })

  const warningsOrError = assertConfig(internalRequest, config)

  if (Array.isArray(warningsOrError)) {
    warningsOrError.forEach(logger.warn)
  } else if (warningsOrError) {
    // If there's an error in the user config, bail out early
    logger.error(warningsOrError)
    const htmlPages = new Set<AuthAction>([
      "signin",
      "signout",
      "error",
      "verify-request",
    ])
    if (
      !htmlPages.has(internalRequest.action) ||
      internalRequest.method !== "GET"
    ) {
      const message =
        "There was a problem with the server configuration. Check the server logs for more information."
      return Response.json({ message }, { status: 500 })
    }

    const { pages, theme } = config

    // If this is true, the config required auth on the error page
    // which could cause a redirect loop
    const authOnErrorPage =
      pages?.error &&
      internalRequest.url.searchParams
        .get("callbackUrl")
        ?.startsWith(pages.error)

    // Either there was no error page configured or the configured one contains infinite redirects
    if (!pages?.error || authOnErrorPage) {
      if (authOnErrorPage) {
        logger.error(
          new ErrorPageLoop(
            `The error page ${pages?.error} should not require authentication`
          )
        )
      }

      const page = renderPage({ theme }).error("Configuration")
      return toResponse(page)
    }

    return Response.redirect(`${pages.error}?error=Configuration`)
  }

  const isRedirect = request.headers?.has("X-Auth-Return-Redirect")
  const isRaw = config.raw === raw
  try {
    const internalResponse = await AuthInternal(internalRequest, config)
    if (isRaw) return internalResponse

    const response = toResponse(internalResponse)
    const url = response.headers.get("Location")

    if (!isRedirect || !url) return response

    return Response.json({ url }, { headers: response.headers })
  } catch (e) {
    const error = e as Error
    logger.error(error)

    const isAuthError = error instanceof AuthError
    if (isAuthError && isRaw && !isRedirect) throw error

    // If the CSRF check failed for POST/session, return a 400 status code.
    // We should not redirect to a page as this is an API route
    if (request.method === "POST" && internalRequest.action === "session")
      return Response.json(null, { status: 400 })

    const isClientSafeErrorType = isClientError(error)
    const type = isClientSafeErrorType ? error.type : "Configuration"

    const params = new URLSearchParams({ error: type })
    if (error instanceof CredentialsSignin) params.set("code", error.code)

    const pageKind = (isAuthError && error.kind) || "error"
    const pagePath =
      config.pages?.[pageKind] ?? `${config.basePath}/${pageKind.toLowerCase()}`
    const url = `${internalRequest.url.origin}${pagePath}?${params}`

    if (isRedirect) return Response.json({ url })
    return Response.redirect(url)
  }
}

/**
 * Configure the {@link Auth} method.
 *
 * @example
 * ```ts
 * import Auth, { type AuthConfig } from "@auth/core"
 *
 * export const authConfig: AuthConfig = {...}
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, authConfig)
 * ```
 *
 * @see [Initialization](https://authjs.dev/reference/core/types#authconfig)
 */
export interface AuthConfig {
  /**
   * List of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   *
   * @default []
   */
  providers: Provider[]
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   *
   * To generate a random string, you can use the Auth.js CLI: `npx auth secret`
   *
   * @note
   * You can also pass an array of secrets, in which case the first secret that successfully
   * decrypts the JWT will be used. This is useful for rotating secrets without invalidating existing sessions.
   * The newer secret should be added to the start of the array, which will be used for all new sessions.
   *
   */
  secret?: string | string[]
  /**
   * Configure your session like if you want to use JWT or a database,
   * how long until an idle session expires, or to throttle write operations in case you are using a database.
   */
  session?: {
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
     * [Documentation](https://authjs.dev/reference/core#authconfig#session) | [Adapter](https://authjs.dev/reference/core#authconfig#adapter) | [About JSON Web Tokens](https://authjs.dev/concepts/session-strategies#jwt-session)
     */
    strategy?: "jwt" | "database"
    /**
     * Relative time from now in seconds when to expire the session
     *
     * @default 2592000 // 30 days
     */
    maxAge?: number
    /**
     * How often the session should be updated in seconds.
     * If set to `0`, session is updated every time.
     *
     * @default 86400 // 1 day
     */
    updateAge?: number
    /**
     * Generate a custom session token for database-based sessions.
     * By default, a random UUID or string is generated depending on the Node.js version.
     * However, you can specify your own custom string (such as CUID) to be used.
     *
     * @default `randomUUID` or `randomBytes.toHex` depending on the Node.js version
     */
    generateSessionToken?: () => string
  }
  /**
   * JSON Web Tokens are enabled by default if you have not specified an {@link AuthConfig.adapter}.
   * JSON Web Tokens are encrypted (JWE) by default. We recommend you keep this behaviour.
   */
  jwt?: Partial<JWTOptions>
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   *
   * @default {}
   * @example
   *
   * ```ts
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   */
  pages?: Partial<PagesOptions>
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   */
  callbacks?: {
    /**
     * Controls whether a user is allowed to sign in or not.
     * Returning `true` continues the sign-in flow.
     * Returning `false` or throwing an error will stop the sign-in flow and redirect the user to the error page.
     * Returning a string will redirect the user to the specified URL.
     *
     * Unhandled errors will throw an `AccessDenied` with the message set to the original error.
     *
     * [`AccessDenied`](https://authjs.dev/reference/core/errors#accessdenied)
     *
     * @example
     * ```ts
     * callbacks: {
     *  async signIn({ profile }) {
     *   // Only allow sign in for users with email addresses ending with "yourdomain.com"
     *   return profile?.email?.endsWith("@yourdomain.com")
     * }
     * ```
     */
    signIn?: (params: {
      user: User | AdapterUser
      account: Account | null
      /**
       * If OAuth provider is used, it contains the full
       * OAuth profile returned by your provider.
       */
      profile?: Profile
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
    }) => Awaitable<boolean | string>
    /**
     * This callback is called anytime the user is redirected to a callback URL (i.e. on signin or signout).
     * By default only URLs on the same host as the origin are allowed.
     * You can use this callback to customise that behaviour.
     *
     * [Documentation](https://authjs.dev/reference/core/types#redirect)
     *
     * @example
     * callbacks: {
     *   async redirect({ url, baseUrl }) {
     *     // Allows relative callback URLs
     *     if (url.startsWith("/")) return `${baseUrl}${url}`
     *
     *     // Allows callback URLs on the same origin
     *     if (new URL(url).origin === baseUrl) return url
     *
     *     return baseUrl
     *   }
     * }
     */
    redirect?: (params: {
      /** URL provided as callback URL by the client */
      url: string
      /** Default base URL of site (can be used as fallback) */
      baseUrl: string
    }) => Awaitable<string>
    /**
     * This callback is called whenever a session is checked.
     * (i.e. when invoking the `/api/session` endpoint, using `useSession` or `getSession`).
     * The return value will be exposed to the client, so be careful what you return here!
     * If you want to make anything available to the client which you've added to the token
     * through the JWT callback, you have to explicitly return it here as well.
     *
     * :::note
     * ⚠ By default, only a subset (email, name, image)
     * of the token is returned for increased security.
     * :::
     *
     * The token argument is only available when using the jwt session strategy, and the
     * user argument is only available when using the database session strategy.
     *
     * [`jwt` callback](https://authjs.dev/reference/core/types#jwt)
     *
     * @example
     * ```ts
     * callbacks: {
     *   async session({ session, token, user }) {
     *     // Send properties to the client, like an access_token from a provider.
     *     session.accessToken = token.accessToken
     *
     *     return session
     *   }
     * }
     * ```
     */
    session?: (
      params: ({
        session: { user: AdapterUser } & AdapterSession
        /** Available when {@link AuthConfig.session} is set to `strategy: "database"`. */
        user: AdapterUser
      } & {
        session: Session
        /** Available when {@link AuthConfig.session} is set to `strategy: "jwt"` */
        token: JWT
      }) & {
        /**
         * Available when using {@link AuthConfig.session} `strategy: "database"` and an update is triggered for the session.
         *
         * :::note
         * You should validate this data before using it.
         * :::
         */
        newSession: any
        trigger?: "update"
      }
    ) => Awaitable<Session | DefaultSession>
    /**
     * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client). Anything you
     * return here will be saved in the JWT and forwarded to the session callback.
     * There you can control what should be returned to the client. Anything else
     * will be kept from your frontend. The JWT is encrypted by default via your
     * AUTH_SECRET environment variable.
     *
     * [`session` callback](https://authjs.dev/reference/core/types#session)
     */
    jwt?: (params: {
      /**
       * When `trigger` is `"signIn"` or `"signUp"`, it will be a subset of {@link JWT},
       * `name`, `email` and `image` will be included.
       *
       * Otherwise, it will be the full {@link JWT} for subsequent calls.
       */
      token: JWT
      /**
       * Either the result of the {@link OAuthConfig.profile} or the {@link CredentialsConfig.authorize} callback.
       * @note available when `trigger` is `"signIn"` or `"signUp"`.
       *
       * Resources:
       * - [Credentials Provider](https://authjs.dev/getting-started/authentication/credentials)
       * - [User database model](https://authjs.dev/guides/creating-a-database-adapter#user-management)
       */
      user: User | AdapterUser
      /**
       * Contains information about the provider that was used to sign in.
       * Also includes {@link TokenSet}
       * @note available when `trigger` is `"signIn"` or `"signUp"`
       */
      account: Account | null
      /**
       * The OAuth profile returned from your provider.
       * (In case of OIDC it will be the decoded ID Token or /userinfo response)
       * @note available when `trigger` is `"signIn"`.
       */
      profile?: Profile
      /**
       * Check why was the jwt callback invoked. Possible reasons are:
       * - user sign-in: First time the callback is invoked, `user`, `profile` and `account` will be present.
       * - user sign-up: a user is created for the first time in the database (when {@link AuthConfig.session}.strategy is set to `"database"`)
       * - update event: Triggered by the `useSession().update` method.
       * In case of the latter, `trigger` will be `undefined`.
       */
      trigger?: "signIn" | "signUp" | "update"
      /** @deprecated use `trigger === "signUp"` instead */
      isNewUser?: boolean
      /**
       * When using {@link AuthConfig.session} `strategy: "jwt"`, this is the data
       * sent from the client via the `useSession().update` method.
       *
       * ⚠ Note, you should validate this data before using it.
       */
      session?: any
    }) => Awaitable<JWT | null>
  }
  /**
   * Events are asynchronous functions that do not return a response, they are useful for audit logging.
   * You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.
   * The content of the message object varies depending on the flow
   * (e.g. OAuth or Email authentication flow, JWT or database sessions, etc),
   * but typically contains a user object and/or contents of the JSON Web Token
   * and other information relevant to the event.
   *
   * @default {}
   */
  events?: {
    /**
     * If using a `credentials` type auth, the user is the raw response from your
     * credential provider.
     * For other providers, you'll get the User object from your adapter, the account,
     * and an indicator if the user was new to your Adapter.
     */
    signIn?: (message: {
      user: User
      account: Account | null
      profile?: Profile
      isNewUser?: boolean
    }) => Awaitable<void>
    /**
     * The message object will contain one of these depending on
     * if you use JWT or database persisted sessions:
     * - `token`: The JWT for this session.
     * - `session`: The session object from your adapter that is being ended.
     */
    signOut?: (
      message:
        | { session: Awaited<ReturnType<Required<Adapter>["deleteSession"]>> }
        | { token: Awaited<ReturnType<JWTOptions["decode"]>> }
    ) => Awaitable<void>
    createUser?: (message: { user: User }) => Awaitable<void>
    updateUser?: (message: { user: User }) => Awaitable<void>
    linkAccount?: (message: {
      user: User | AdapterUser
      account: Account
      profile: User | AdapterUser
    }) => Awaitable<void>
    /**
     * The message object will contain one of these depending on
     * if you use JWT or database persisted sessions:
     * - `token`: The JWT for this session.
     * - `session`: The session object from your adapter.
     */
    session?: (message: { session: Session; token: JWT }) => Awaitable<void>
  }
  /** You can use the adapter option to pass in your database adapter. */
  adapter?: Adapter
  /**
   * Set debug to true to enable debug messages for authentication and database operations.
   *
   * - ⚠ If you added a custom {@link AuthConfig.logger}, this setting is ignored.
   *
   * @default false
   */
  debug?: boolean
  /**
   * Override any of the logger levels (`undefined` levels will use the built-in logger),
   * and intercept logs in NextAuth. You can use this option to send NextAuth logs to a third-party logging service.
   *
   * @example
   *
   * ```ts
   * // /auth.ts
   * import log from "logging-service"
   *
   * export const { handlers, auth, signIn, signOut } = NextAuth({
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
   * - ⚠ When set, the {@link AuthConfig.debug} option is ignored
   *
   * @default console
   */
  logger?: Partial<LoggerInstance>
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: Theme
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean
  /**
   * You can override the default cookie names and options for any of the cookies used by Auth.js.
   * You can specify one or more cookies with custom properties
   * and missing options will use the default values defined by Auth.js.
   * If you use this feature, you will likely want to create conditional behavior
   * to support setting different cookies policies in development and production builds,
   * as you will be opting out of the built-in dynamic policy.
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * @default {}
   */
  cookies?: Partial<CookiesOptions>
  /**
   * Auth.js relies on the incoming request's `host` header to function correctly. For this reason this property needs to be set to `true`.
   *
   * Make sure that your deployment platform sets the `host` header safely.
   *
   * :::note
   * Official Auth.js-based libraries will attempt to set this value automatically for some deployment platforms (eg.: Vercel) that are known to set the `host` header safely.
   * :::
   */
  trustHost?: boolean
  skipCSRFCheck?: typeof skipCSRFCheck
  raw?: typeof raw
  /**
   * When set, during an OAuth sign-in flow,
   * the `redirect_uri` of the authorization request
   * will be set based on this value.
   *
   * This is useful if your OAuth Provider only supports a single `redirect_uri`
   * or you want to use OAuth on preview URLs (like Vercel), where you don't know the final deployment URL beforehand.
   *
   * The url needs to include the full path up to where Auth.js is initialized.
   *
   * @note This will auto-enable the `state` {@link OAuth2Config.checks} on the provider.
   *
   * @example
   * ```
   * "https://authjs.example.com/api/auth"
   * ```
   *
   * You can also override this individually for each provider.
   *
   * @example
   * ```ts
   * GitHub({
   *   ...
   *   redirectProxyUrl: "https://github.example.com/api/auth"
   * })
   * ```
   *
   * @default `AUTH_REDIRECT_PROXY_URL` environment variable
   *
   * See also: [Guide: Securing a Preview Deployment](https://authjs.dev/getting-started/deployment#securing-a-preview-deployment)
   */
  redirectProxyUrl?: string

  /**
   * Use this option to enable experimental features.
   * When enabled, it will print a warning message to the console.
   * @note Experimental features are not guaranteed to be stable and may change or be removed without notice. Please use with caution.
   * @default {}
   */
  experimental?: {
    /**
     * Enable WebAuthn support.
     *
     * @default false
     */
    enableWebAuthn?: boolean
  }
  /**
   * The base path of the Auth.js API endpoints.
   *
   * @default "/api/auth" in "next-auth"; "/auth" with all other frameworks
   */
  basePath?: string
}
