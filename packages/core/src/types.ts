/**
 *
 * This module contains public types and interfaces of the core package.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core
 * ```
 *
 * You can then import this submodule from `@auth/core/type`.
 *
 * ## Usage
 *
 * Even if you don't use TypeScript, IDEs like VSCode will pick up types to provide you with a better developer experience.
 * While you are typing, you will get suggestions about what certain objects/functions look like,
 * and sometimes links to documentation, examples, and other valuable resources.
 *
 * Generally, you will not need to import types from this module.
 * Mostly when using the `Auth` function and optionally the `AuthConfig` interface,
 * everything inside there will already be typed.
 *
 * :::tip
 * Inside the `Auth` function, you won't need to use a single type from this module.
 *
 * @example
 * ```ts title=index.ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {
 *   callbacks: {
 *     jwt(): JWT { // <-- This is unnecessary!
 *       return { foo: "bar" }
 *     },
 *     session(
 *        { session, token }: { session: Session; token: JWT } // <-- This is unnecessary!
 *     ) {
 *       return session
 *     },
 *   }
 * })
 * ```
 * :::
 *
 * :::info
 * We are advocates of TypeScript, as it will help you catch errors at build-time, before your users do. 😉
 * :::
 *
 * ## Resources
 *
 * - [TypeScript - The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
 * - [Extending built-in types](https://authjs.dev/getting-started/typescript#module-augmentation)
 *
 * @module types
 */

import type { CookieSerializeOptions } from "cookie"
import type {
  OAuth2TokenEndpointResponse,
  OpenIDTokenEndpointResponse,
} from "oauth4webapi"
import type { Adapter, AdapterUser } from "./adapters.js"
import { AuthConfig } from "./index.js"
import type { JWT, JWTOptions } from "./jwt.js"
import type { Cookie } from "./lib/utils/cookie.js"
import type { LoggerInstance } from "./lib/utils/logger.js"
import type {
  CredentialInput,
  CredentialsConfig,
  EmailConfig,
  OAuthConfigInternal,
  OIDCConfigInternal,
  ProviderType,
} from "./providers/index.js"

export type { AuthConfig } from "./index.js"
export type { LoggerInstance }
export type Awaitable<T> = T | PromiseLike<T>

/**
 * Change the theme of the built-in pages.
 *
 * [Documentation](https://authjs.dev/reference/core#authconfig#theme) |
 * [Pages](https://authjs.dev/guides/basics/pages)
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
export type TokenSet = Partial<
  OAuth2TokenEndpointResponse | OpenIDTokenEndpointResponse
> & {
  /**
   * Date of when the `access_token` expires in seconds.
   * This value is calculated from the `expires_in` value.
   *
   * @see https://www.ietf.org/rfc/rfc6749.html#section-4.2.2
   */
  expires_at?: number
}

/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends Partial<OpenIDTokenEndpointResponse> {
  /** Provider's id for this account. Eg.: "google" */
  provider: string
  /**
   * This value depends on the type of the provider being used to create the account.
   * - oauth/oidc: The OAuth account's id, returned from the `profile()` callback.
   * - email: The user's email address.
   * - credentials: `id` returned from the `authorize()` callback
   */
  providerAccountId: string
  /** Provider's type for this account */
  type: ProviderType
  /**
   * id of the user this account belongs to
   *
   * @see https://authjs.dev/reference/core/adapters#user
   */
  userId?: string
  /**
   * Calculated value based on {@link OAuth2TokenEndpointResponse.expires_in}.
   *
   * It is the absolute timestamp (in seconds) when the {@link OAuth2TokenEndpointResponse.access_token} expires.
   *
   * This value can be used for implementing token rotation together with {@link OAuth2TokenEndpointResponse.refresh_token}.
   *
   * @see https://authjs.dev/guides/basics/refresh-token-rotation#database-strategy
   * @see https://www.rfc-editor.org/rfc/rfc6749#section-5.1
   */
  expires_at?: number
}

/**
 * The user info returned from your OAuth provider.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 */
export interface Profile {
  sub?: string | null
  name?: string | null
  given_name?: string | null
  family_name?: string | null
  middle_name?: string | null
  nickname?: string | null
  preferred_username?: string | null
  profile?: string | null
  picture?: string | null | any
  website?: string | null
  email?: string | null
  email_verified?: boolean | null
  gender?: string | null
  birthdate?: string | null
  zoneinfo?: string | null
  locale?: string | null
  phone_number?: string | null
  updated_at?: Date | string | number | null
  address?: {
    formatted?: string | null
    street_address?: string | null
    locality?: string | null
    region?: string | null
    postal_code?: string | null
    country?: string | null
  } | null
  [claim: string]: unknown
}

// TODO: rename `signIn` to `authorized`

/** Override the default session creation flow of Auth.js */
export interface CallbacksOptions<P = Profile, A = Account> {
  /**
   * Controls whether a user is allowed to sign in or not.
   * Returning `true` continues the sign-in flow, while
   * returning `false` throws an `AuthorizedCallbackError` with the message `"AccessDenied"`.
   *
   * Unhandled errors will throw an `AuthorizedCallbackError` with the message set to the original error.
   *
   * @see [`AuthorizedCallbackError`](https://authjs.dev/reference/errors#authorizedcallbackerror)
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
  }) => Awaitable<boolean>
  /**
   * This callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).
   * By default only URLs on the same URL as the site are allowed,
   * you can use this callback to customise that behaviour.
   *
   * [Documentation](https://authjs.dev/guides/basics/callbacks#redirect-callback)
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
   * @see [`jwt` callback](https://authjs.dev/reference/core/types#jwt)
   */
  session: (
    params:
      | {
          session: Session
          /** Available when {@link AuthConfig.session} is set to `strategy: "jwt"` */
          token: JWT
          /** Available when {@link AuthConfig.session} is set to `strategy: "database"`. */
          user: AdapterUser
        } & {
          /**
           * Available when using {@link AuthConfig.session} `strategy: "database"` and an update is triggered for the session.
           *
           * :::note
           * You should validate this data before using it.
           * :::
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
  jwt: (params: {
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
     * - [Credentials Provider](https://authjs.dev/reference/core/providers/credentials)
     * - [User database model](https://authjs.dev/reference/core/adapters#user)
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
     * - user sign-up: a user is created for the first time in the database (when {@link AuthConfig.session}.strategy is set to `"database"`)
     * - update event: Triggered by the [`useSession().update`](https://next-auth.js.org/getting-started/client#update-session) method.
     * In case of the latter, `trigger` will be `undefined`.
     */
    trigger?: "signIn" | "signUp" | "update"
    /** @deprecated use `trigger === "signUp"` instead */
    isNewUser?: boolean
    /**
     * When using {@link AuthConfig.session} `strategy: "jwt"`, this is the data
     * sent from the client via the [`useSession().update`](https://next-auth.js.org/getting-started/client#update-session) method.
     *
     * ⚠ Note, you should validate this data before using it.
     */
    session?: any
  }) => Awaitable<JWT | null>
}

/** [Documentation](https://authjs.dev/reference/core#cookies) */
export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

/** [Documentation](https://authjs.dev/reference/core#cookies) */
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
 * [Documentation](https://authjs.dev/guides/basics/events)
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
   * - `token`: The JWT for this session.
   * - `session`: The session object from your adapter that is being ended.
   */
  signOut: (
    message:
      | { session: Awaited<ReturnType<Required<Adapter>["deleteSession"]>> }
      | { token: Awaited<ReturnType<JWTOptions["decode"]>> }
  ) => Awaitable<void>
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
   * - `token`: The JWT for this session.
   * - `session`: The session object from your adapter.
   */
  session: (message: { session: Session; token: JWT }) => Awaitable<void>
}

export type EventType = keyof EventCallbacks

/** TODO: Check if all these are used/correct */
export type ErrorPageParam = "Configuration" | "AccessDenied" | "Verification"

/** TODO: Check if all these are used/correct */
export type SignInPageErrorParam =
  | "Signin"
  | "OAuthSignin"
  | "OAuthCallbackError"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"

export interface PagesOptions {
  /**
   * The path to the sign in page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link SignInPageErrorParam available} values.
   *
   * @default "/signin"
   */
  signIn: string
  signOut: string
  /**
   * The path to the error page.
   *
   * The optional "error" query parameter is set to
   * one of the {@link ErrorPageParam available} values.
   *
   * @default "/error"
   */
  error: string
  verifyRequest: string
  /** If set, new users will be directed here on first sign in */
  newUser: string
}

type ISODateString = string

export interface DefaultSession {
  user?: User
  expires: ISODateString
}

/**
 * Returned by `useSession`, `getSession`, returned by the `session` callback
 * and also the shape received as a prop on the `SessionProvider` React Context
 *
 * [`useSession`](https://authjs.devreference/nextjs/react/#usesession) |
 * [`getSession`](https://authjs.dev/reference/utilities#getsession) |
 * [`SessionProvider`](https://authjs.devreference/nextjs/react#sessionprovider) |
 * [`session` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback)
 */
export interface Session extends DefaultSession {}

/**
 * The shape of the returned object in the OAuth providers' `profile` callback,
 * available in the `jwt` and `session` callbacks,
 * or the second parameter of the `session` callback, when using a database.
 *
 * [`signIn` callback](https://authjs.dev/guides/basics/callbacks#sign-in-callback) |
 * [`session` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
 * [`jwt` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
 * [`profile` OAuth provider callback](https://authjs.dev/guides/providers/custom-provider)
 */
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

// Below are types that are only supposed be used by next-auth internally

/** @internal */
export type InternalProvider<T = ProviderType> = (T extends "oauth"
  ? OAuthConfigInternal<any>
  : T extends "oidc"
  ? OIDCConfigInternal<any>
  : T extends "email"
  ? EmailConfig
  : T extends "credentials"
  ? CredentialsConfig
  : never) & {
  signinUrl: string
  /** @example `"https://example.com/api/auth/callback/id"` */
  callbackUrl: string
}

export interface PublicProvider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

/**
 * Supported actions by Auth.js. Each action map to a REST API endpoint.
 * Some actions have a `GET` and `POST` variant, depending on if the action
 * changes the state of the server.
 *
 * - **`"callback"`**:
 *   - **`GET`**: Handles the callback from an [OAuth provider](https://authjs.dev/reference/core/providers/oauth).
 *   - **`POST`**: Handles the callback from a [Credentials provider](https://authjs.dev/reference/core/providers/credentials).
 * - **`"csrf"`**: Returns the raw CSRF token, which is saved in a cookie (encrypted).
 * It is used for CSRF protection, implementing the [double submit cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie) technique.
 * :::note
 * Some frameworks have built-in CSRF protection and can therefore disable this action. In this case, the corresponding endpoint will return a 404 response. Read more at [`skipCSRFCheck`](https://authjs.dev/reference/core#skipcsrfcheck).
 * _⚠ We don't recommend manually disabling CSRF protection, unless you know what you're doing._
 * :::
 * - **`"error"`**: Renders the built-in error page.
 * - **`"providers"`**: Returns a client-safe list of all configured providers.
 * - **`"session"`**:
 *   - **`GET**`: Returns the user's session if it exists, otherwise `null`.
 *   - **`POST**`: Updates the user's session and returns the updated session.
 * - **`"signin"`**:
 *   - **`GET`**: Renders the built-in sign-in page.
 *   - **`POST`**: Initiates the sign-in flow.
 * - **`"signout"`**:
 *   - **`GET`**: Renders the built-in sign-out page.
 *   - **`POST`**: Initiates the sign-out flow. This will invalidate the user's session (deleting the cookie, and if there is a session in the database, it will be deleted as well).
 * - **`"verify-request"`**: Renders the built-in verification request page.
 */
export type AuthAction =
  | "callback"
  | "csrf"
  | "error"
  | "providers"
  | "session"
  | "signin"
  | "signout"
  | "verify-request"

/** @internal */
export interface RequestInternal {
  url: URL
  method: "GET" | "POST"
  cookies?: Partial<Record<string, string>>
  headers?: Record<string, any>
  query?: Record<string, any>
  body?: Record<string, any>
  action: AuthAction
  providerId?: string
  error?: string
}

// Should only be used by frameworks
export interface ResponseInternal<
  Body extends string | Record<string, any> | any[] | null = any
> {
  status?: number
  headers?: Headers | HeadersInit
  body?: Body
  redirect?: string
  cookies?: Cookie[]
}

/** @internal */
export interface InternalOptions<TProviderType = ProviderType> {
  providers: InternalProvider[]
  url: URL
  action: AuthAction
  provider: InternalProvider<TProviderType>
  csrfToken?: string
  /**
   * `true` if the [Double-submit CSRF check](https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf) was succesful
   * or [`skipCSRFCheck`](https://authjs.dev/reference/core#skipcsrfcheck) was enabled.
   */
  csrfTokenVerified?: boolean
  secret: string
  theme: Theme
  debug: boolean
  logger: LoggerInstance
  session: NonNullable<Required<AuthConfig["session"]>>
  pages: Partial<PagesOptions>
  jwt: JWTOptions
  events: Partial<EventCallbacks>
  adapter: Required<Adapter> | undefined
  callbacks: CallbacksOptions
  cookies: CookiesOptions
  callbackUrl: string
  /**
   * If true, the OAuth callback is being proxied by the server to the original URL.
   * See also {@link OAuthConfigInternal.redirectProxyUrl}.
   */
  isOnRedirectProxy: boolean
}
