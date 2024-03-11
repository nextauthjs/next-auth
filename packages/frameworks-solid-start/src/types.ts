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
  redirectTo?: string
  redirect?: boolean
}

export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

export interface SignOutParams<R extends boolean = true> {
  redirectTo?: string
  redirect?: R
}
