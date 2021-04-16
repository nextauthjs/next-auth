// Minimum TypeScript Version: 3.5

/// <reference types="node" />

import { ConnectionOptions } from "typeorm"
import { Adapter } from "./adapters"
import { JWTOptions, JWT } from "./jwt"
import { AppProvider, AppProviders } from "./providers"
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next"
import { Awaitable, WithAdditionalParams } from "./_utils"

/** @docs https://next-auth.js.org/configuration/options */
export interface NextAuthOptions {
  /** @docs https://next-auth.js.org/configuration/options#theme */
  theme?: "auto" | "dark" | "light"
  /** @docs https://next-auth.js.org/configuration/options#providers */
  providers: AppProviders
  /** @docs https://next-auth.js.org/configuration/options#database */
  database?: string | Record<string, any> | ConnectionOptions
  /** @docs https://next-auth.js.org/configuration/options#secret */
  secret?: string
  /** @docs https://next-auth.js.org/configuration/options#session */
  session?: SessionOptions
  /** @docs https://next-auth.js.org/configuration/options#jwt */
  jwt?: JWTOptions
  /** @docs https://next-auth.js.org/configuration/options#pages */
  pages?: PagesOptions
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as
   * they allow you to implement access controls without a database and
   * to integrate with external databases or APIs.
   * @docs https://next-auth.js.org/configuration/options#callbacks
   */
  callbacks?: CallbacksOptions
  /** @docs https://next-auth.js.org/configuration/options#events */
  events?: EventsOptions
  /** @docs https://next-auth.js.org/configuration/options#adapter */
  adapter?: Adapter
  /** @docs https://next-auth.js.org/configuration/options#debug */
  debug?: boolean
  /** @docs https://next-auth.js.org/configuration/options#usesecurecookies */
  useSecureCookies?: boolean
  /** @docs https://next-auth.js.org/configuration/options#cookies */
  cookies?: CookiesOptions
  /** @docs https://next-auth.js.org/configuration/options#logger */
  logger?: LoggerInstance
}

export interface LoggerInstance {
  warn(code: string, ...message: unknown[]): void
  error(code: string, ...message: unknown[]): void
  debug(code: string, ...message: unknown[]): void
}

export interface TokenSet {
  accessToken: string
  idToken?: string
  refreshToken?: string
  access_token: string
  expires_in?: number | null
  refresh_token?: string
  id_token?: string
}

export interface Account extends TokenSet, Record<string, unknown> {
  id: string
  provider: string
  type: string
}
export interface Profile extends Record<string, unknown> {
  sub?: string
  name?: string
  email?: string
  image?: string
}

export interface CallbacksOptions<
  P extends Record<string, unknown> = Profile,
  A extends Record<string, unknown> = Account
> {
  signIn?(user: User, account: A, profile: P): Awaitable<string | boolean>
  redirect?(url: string, baseUrl: string): Awaitable<string>
  session?(session: Session, userOrToken: JWT | User): Awaitable<Session>
  jwt?(
    token: JWT,
    user?: User,
    account?: A,
    profile?: P,
    isNewUser?: boolean
  ): Awaitable<JWT>
}

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

export interface CookiesOptions {
  sessionToken?: CookieOption
  callbackUrl?: CookieOption
  csrfToken?: CookieOption
  pkceCodeVerifier?: CookieOption
}

export type EventType =
  | "signIn"
  | "signOut"
  | "createUser"
  | "updateUser"
  | "linkAccount"
  | "session"
  | "error"

export type EventCallback = (message: any) => Promise<void>

export type EventsOptions = Partial<Record<EventType, EventCallback>>

export interface PagesOptions {
  signIn?: string
  signOut?: string
  /** Error code passed in query string as ?error= */
  error?: string
  verifyRequest?: string
  /** If set, new users will be directed here on first sign in */
  newUser?: string
}

export interface Session extends Record<string, unknown> {
  user?: WithAdditionalParams<User>
  accessToken?: string
  expires: string
}

export interface SessionOptions {
  jwt?: boolean
  maxAge?: number
  updateAge?: number
}

export interface User {
  name?: string | null
  email?: string | null
  image?: string | null
}

/** Options that are the same both in internal and user provided options. */
export type NextAuthSharedOptions =
  | "pages"
  | "jwt"
  | "events"
  | "callbacks"
  | "cookies"
  | "secret"
  | "adapter"
  | "theme"
  | "debug"
  | "logger"

export interface AppOptions
  extends Pick<NextAuthOptions, NextAuthSharedOptions> {
  pkce?: {
    code_verifier?: string
    /**
     * Could be `"plain"`, but not recommended.
     * We ignore it for now.
     * @spec https://tools.ietf.org/html/rfc7636#section-4.2.
     */
    code_challenge_method?: "S256"
  }
  provider?: AppProvider
  providers: AppProvider[]
  baseUrl?: string
  basePath?: string
  action?:
    | "providers"
    | "session"
    | "csrf"
    | "signin"
    | "signout"
    | "callback"
    | "verify-request"
    | "error"
  csrfToken?: string
}

export interface NextAuthRequest extends NextApiRequest {
  options: AppOptions
}

export type NextAuthResponse = NextApiResponse

declare function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
): ReturnType<NextApiHandler>

declare function NextAuth(options: NextAuthOptions): ReturnType<NextApiHandler>

export default NextAuth
