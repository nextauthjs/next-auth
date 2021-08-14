import { Awaitable, NextApiRequest, NextApiResponse } from "./utils"
import {
  CallbacksOptions,
  CookiesOptions,
  EventCallbacks,
  LoggerInstance,
  PagesOptions,
  SessionOptions,
  Theme,
} from ".."
import { Provider } from "../providers"
import { JWTOptions } from "../jwt"
import { Adapter } from "../adapters"

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
  adapter: Adapter
  callbacks: CallbacksOptions
  cookies: CookiesOptions
  callbackUrl: string
}

export interface NextAuthRequest extends NextApiRequest {
  options: InternalOptions
}

export type NextAuthResponse = NextApiResponse

export type NextAuthApiHandler<R = void> = (
  req: NextAuthRequest,
  res: NextAuthResponse
) => Awaitable<R>
