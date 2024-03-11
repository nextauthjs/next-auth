/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Session } from '@auth/core/types'
import type { JSX } from 'solid-js'

export interface AuthClientConfig {
  baseUrl: string
  basePath: string
  baseUrlServer: string
  basePathServer: string
  _session?: Session | null | undefined
  _lastSync: number
  _getSession: (...args: any[]) => any
}

export interface SessionProviderProps {
  children: JSX.Element
  baseUrl?: string
  basePath?: string
  refetchOnWindowFocus?: boolean
}

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<never, never>)

export interface SignInOptions extends Record<string, unknown> {
  /**
   * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
   *
   * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
   */
  redirectTo?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
  redirect?: boolean
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

export interface SignOutParams<R extends boolean = true> {
  /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
  redirectTo?: string
    /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}
