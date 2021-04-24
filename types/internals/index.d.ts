import { NextApiRequest, NextApiResponse } from "./utils"
import { NextAuthOptions } from ".."
import { AppProvider } from "../providers"

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
  | "session"

export interface AppOptions
  extends Required<Pick<NextAuthOptions, NextAuthSharedOptions>> {
  providers: AppProvider[]
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
  provider?: AppProvider
  csrfToken?: string
  csrfTokenVerified?: boolean
}

export interface NextAuthRequest extends NextApiRequest {
  options: AppOptions
}

export type NextAuthResponse = NextApiResponse
