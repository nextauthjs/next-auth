import type { NextApiRequest, NextApiResponse } from "next"

import type {
  CallbacksOptions,
  CookiesOptions,
  EventCallbacks,
  LoggerInstance,
  PagesOptions,
  SessionOptions,
  Theme,
  Awaitable,
} from ".."

import type {
  OAuthConfig,
  EmailConfig,
  CredentialsConfig,
  ProviderType,
} from "../providers"
import type { JWTOptions } from "../jwt"
import type { Adapter } from "../adapters"
import { InternalUrl } from "./parse-url"

// Below are types that are only supposed be used by next-auth internally

/** @internal */
export type InternalProvider<T extends ProviderType = any> = (T extends "oauth"
  ? OAuthConfig<any>
  : T extends "email"
  ? EmailConfig
  : T extends "credentials"
  ? CredentialsConfig
  : never) & {
  signinUrl: string
  callbackUrl: string
}

export type NextAuthAction =
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
export interface InternalOptions<T extends ProviderType = any> {
  providers: InternalProvider[]
  /**
   * Parsed from `NEXTAUTH_URL` or `VERCEL_URL`.
   * @default "http://localhost:3000/api/auth"
   */
  url: InternalUrl
  action: NextAuthAction
  provider: T extends string
    ? InternalProvider<T>
    : InternalProvider<T> | undefined
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
