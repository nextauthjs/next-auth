// Minimum TypeScript Version: 3.5

/// <reference types="node" />

import { ConnectionOptions } from "typeorm"
import { Adapter } from "./adapters"
import { JWTOptions, JWT } from "./jwt"
import { AppProvider, Providers } from "./providers"
import { NextApiRequest, NextApiResponse, NextApiHandler } from "./_next"
import { Awaitable, NonNullParams, WithAdditionalParams } from "./_utils"

export interface NextAuthOptions {
  providers: Providers
  database?: string | Record<string, any> | ConnectionOptions
  secret?: string
  session?: SessionOptions
  jwt?: JWTOptions
  pages?: PagesOptions
  callbacks?: CallbacksOptions
  debug?: boolean
  adapter?: Adapter
  events?: EventsOptions
  useSecureCookies?: boolean
  cookies?: CookiesOptions
  logger?: LoggerInstance
  theme?: "light" | "dark" | "auto"
}

export interface LoggerInstance {
  warn: (code?: string, ...message: unknown[]) => void
  error: (code?: string, ...message: unknown[]) => void
  debug: (code?: string, ...message: unknown[]) => void
}

interface InternalOptions
  extends Omit<
    NextAuthOptions,
    "providers" | "database" | "session" | "useSecureCookie"
  > {
  pkce: {
    code_verifier?: string
    code_challenge_method?: "S256"
  }
  provider?: string
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

export interface AppOptions
  extends Omit<NextApiRequest, "cookies">,
    NonNullParams<InternalOptions> {
  providers: AppProvider[]
}

export interface Account extends Record<string, unknown> {
  accessToken: string
  idToken?: string
  refreshToken?: string
  access_token: string
  expires_in?: number | null
  refresh_token?: string
  id_token?: string
  id: string
  provider: string
  type: string
}
export interface Profile extends Record<string, unknown> {}

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
  error?: string
  verifyRequest?: string
  newUser?: string | null
}

export interface Session {
  user: WithAdditionalParams<User>
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

export interface NextAuthRequest extends NextApiRequest {
  options: InternalOptions
}
export type NextAuthResponse = NextApiResponse

declare function NextAuthHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: NextAuthOptions
): ReturnType<NextApiHandler>
declare function NextAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  options?: NextAuthOptions
): ReturnType<NextApiHandler>
declare function NextAuth(
  options: NextAuthOptions
): ReturnType<typeof NextAuthHandler>

export { NextAuthHandler, NextAuth }
export default NextAuth
