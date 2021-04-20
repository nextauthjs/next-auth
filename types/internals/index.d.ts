import { NextApiRequest, NextApiResponse } from "./utils"
import { NextAuthOptions } from ".."
import { AppProvider } from "./providers"

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
  csrfTokenVerified?: boolean
}

export interface NextAuthRequest extends NextApiRequest {
  options: AppOptions
}

export type NextAuthResponse = NextApiResponse
