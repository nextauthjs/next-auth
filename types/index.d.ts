// Minimum TypeScript Version: 3.5

/// <reference types="node" />

import { ConnectionOptions } from "typeorm"
import { Adapter } from "./adapters"
import { JWTOptions, JWT } from "./jwt"
import { AppProviders } from "./providers"
import { Awaitable, NextApiRequest, NextApiResponse, NextApiHandler } from "internals/utils"

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
  user?: User
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

declare function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
): ReturnType<NextApiHandler>

declare function NextAuth(options: NextAuthOptions): ReturnType<NextApiHandler>

export default NextAuth
