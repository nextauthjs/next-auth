import type { Session } from ".."
import type { BuiltInProviderType, ProviderType } from "../providers"

export interface UseSessionOptions<R extends boolean> {
  required: R
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void
}

/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

export interface ClientSafeProvider {
  id: LiteralUnion<BuiltInProviderType>
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Defaults to the current URL.
   * @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
   */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option */
  redirect?: boolean
}

export interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorisationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

/** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
export interface SignOutResponse {
  url: string
}

export interface SignOutParams<R extends boolean = true> {
  /** @docs https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1 */
  callbackUrl?: string
  /** @docs https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/** @docs: https://next-auth.js.org/getting-started/client#options */
export interface SessionProviderProps {
  children: React.ReactNode
  session?: Session | null
  baseUrl?: string
  basePath?: string
  /**
   * A time interval (in seconds) after which the session will be re-fetched.
   * If set to `0` (default), the session is not polled.
   */
  refetchInterval?: number
  /**
   * `SessionProvider` automatically refetches the session when the user switches between windows.
   * This option activates this behaviour if set to `true` (default).
   */
  refetchOnWindowFocus?: boolean
}
