/**
 *
 * This module contains public types and interfaces of the core package.
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
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
import type {
  CredentialInput,
  CredentialsConfig,
  EmailConfig,
  OAuthConfigInternal,
  ProviderType,
} from "./providers/index.js"
import type { JWT, JWTOptions } from "./jwt.js"
import type { Cookie } from "./lib/cookie.js"
import type { LoggerInstance } from "./lib/utils/logger.js"

export type { AuthConfig } from "./index.js"
export type Awaitable<T> = T | PromiseLike<T>
export type { LoggerInstance }

/**
 * Change the theme of the built-in pages.
 *
 * [Documentation](https://authjs.dev/reference/configuration/auth-config#theme) |
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
>

/**
 * Usually contains information about the provider being used
 * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
 */
export interface Account extends Partial<OpenIDTokenEndpointResponse> {
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

/** [Documentation](https://authjs.dev/guides/basics/callbacks) */
export interface CallbacksOptions<P = Profile, A = Account> {
  /**
   * Control whether a user is allowed to sign in or not.
   * Returning `true` continues the sign-in flow, while
   * returning `false` redirects to the {@link PagesOptions.error error page}.
   * The `error` {@link ErrorPageParam parameter} is set to `AccessDenied`.
   *
   * Unhandled errors are redirected to the error page
   * The `error` parameter is set to `Configuration`.
   * an `AuthorizedCallbackError` is logged on the server.
   *
   * @see https://authjs.dev/reference/errors#authorizedcallbackerror
   * @todo rename to `authorized`
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
   * [Documentation](https://authjs.dev/guides/basics/callbacks#session-callback) |
   * [`jwt` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
   * [`useSession`](https://authjs.dev/reference/react/#usesession) |
   * [`getSession`](https://authjs.dev/reference/utilities/#getsession) |
   *
   */
  session: (params: {
    session: Session
    user: User | AdapterUser
    token: JWT
  }) => Awaitable<Session>
  /**
   * This callback is called whenever a JSON Web Token is created (i.e. at sign in)
   * or updated (i.e whenever a session is accessed in the client).
   * Its content is forwarded to the `session` callback,
   * where you can control what should be returned to the client.
   * Anything else will be kept inaccessible from the client.
   * 
   * Returning `null` will invalidate the JWT session by clearing
   * the user's cookies. You'll still have to monitor and invalidate
   * unexpired tokens from future requests yourself to prevent
   * unauthorized access.
   *
   * By default the JWT is encrypted.
   *
   * [Documentation](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
   * [`session` callback](https://authjs.dev/guides/basics/callbacks#session-callback)
   */
  jwt: (params: {
    token: JWT
    user?: User | AdapterUser
    account?: A | null
    profile?: P
    isNewUser?: boolean
  }) => Awaitable<JWT|null>
}

/** [Documentation](https://authjs.dev/reference/configuration/auth-config#cookies) */
export interface CookieOption {
  name: string
  options: CookieSerializeOptions
}

/** [Documentation](https://authjs.dev/reference/configuration/auth-config#cookies) */
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
   * - `token`: The JWT token for this session.
   * - `session`: The session object from your adapter that is being ended.
   */
  signOut: (
    message:
      | { session: Awaited<ReturnType<Adapter["deleteSession"]>> }
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
   * - `token`: The JWT token for this session.
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
  | "OAuthCallback"
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
 * [`useSession`](https://authjs.dev/reference/react/#usesession) |
 * [`getSession`](https://authjs.dev/reference/utilities#getsession) |
 * [`SessionProvider`](https://authjs.dev/reference/react#sessionprovider) |
 * [`session` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback)
 */
export interface Session extends DefaultSession {}

export type SessionStrategy = "jwt" | "database"

/** [Documentation](https://authjs.dev/reference/configuration/auth-config#session) */
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
   * [Documentation](https://authjs.dev/reference/configuration/auth-config#session) | [Adapter](https://authjs.dev/reference/configuration/auth-config#adapter) | [About JSON Web Tokens](https://authjs.dev/reference/faq#json-web-tokens)
   */
  strategy: SessionStrategy
  /**
   * Relative time from now in seconds when to expire the session
   *
   * @default 2592000 // 30 days
   */
  maxAge: number
  /**
   * How often the session should be updated in seconds.
   * If set to `0`, session is updated every time.
   *
   * @default 86400 // 1 day
   */
  updateAge: number
  /**
   * Generate a custom session token for database-based sessions.
   * By default, a random UUID or string is generated depending on the Node.js version.
   * However, you can specify your own custom string (such as CUID) to be used.
   *
   * @default `randomUUID` or `randomBytes.toHex` depending on the Node.js version
   */
  generateSessionToken: () => string
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
 * [`signIn` callback](https://authjs.dev/guides/basics/callbacks#sign-in-callback) |
 * [`session` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
 * [`jwt` callback](https://authjs.dev/guides/basics/callbacks#jwt-callback) |
 * [`profile` OAuth provider callback](https://authjs.dev/guides/providers/custom-provider)
 */
export interface User extends DefaultUser {}

// Below are types that are only supposed be used by next-auth internally

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

/** @internal */
export interface ResponseInternal<
  Body extends string | Record<string, any> | any[] = any
> {
  status?: number
  headers?: Headers | HeadersInit
  body?: Body
  redirect?: URL | string
  cookies?: Cookie[]
}

// TODO: rename to AuthConfigInternal
/** @internal */
export interface InternalOptions<TProviderType = ProviderType> {
  providers: InternalProvider[]
  url: URL
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
  adapter: Adapter | undefined
  callbacks: CallbacksOptions
  cookies: CookiesOptions
  callbackUrl: string
}
