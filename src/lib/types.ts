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

import type { Provider } from "../providers"
import type { JWTOptions } from "../jwt"
import type { Adapter } from "../adapters"

// Below are types that are only supposed be used by next-auth internally

/** @internal */
export type InternalProvider = Provider & {
  signinUrl: string
  callbackUrl: string
}

/** @internal */
export interface InternalOptions<
  P extends InternalProvider = InternalProvider
> {
  providers: InternalProvider[]
  baseUrl: string
  basePath: string
  action:
    | "providers"
    | "session"
    | "csrf"
    | "signin"
    | "signout"
    | "callback"
    | "verify-request"
    | "error"
  provider: P
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
