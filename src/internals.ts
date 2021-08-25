// This file contains types used by next-auth internally

import { NextApiRequest, NextApiResponse } from "next"

import {
  CallbacksOptions,
  CookiesOptions,
  EventCallbacks,
  LoggerInstance,
  PagesOptions,
  SessionOptions,
  Theme,
} from "."

import { Provider } from "./providers"
import { JWTOptions } from "./jwt"
import { Adapter } from "./adapters"

export type InternalProvider = Provider & {
  signinUrl: string
  callbackUrl: string
}

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

export interface NextAuthRequest extends NextApiRequest {
  options: InternalOptions
}

export type NextAuthResponse<T = any> = NextApiResponse<T>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type NextAuthApiHandler<Result = void, Response = any> = (
  req: NextAuthRequest,
  res: NextAuthResponse<Response>
) => Awaitable<Result>

export type Awaitable<T> = T | PromiseLike<T>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      _NEXTAUTH_DEBUG?: boolean
    }
  }
}
