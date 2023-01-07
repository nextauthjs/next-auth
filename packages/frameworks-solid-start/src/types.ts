import { type Session } from "@auth/core/types"
import { type JSX } from "solid-js"
export interface AuthClientConfig {
  baseUrl: string
  basePath: string
  baseUrlServer: string
  basePathServer: string
  /** Stores last session response */
  _session?: Session | null | undefined
  /** Used for timestamp since last sycned (in seconds) */
  _lastSync: number
  /**
   * Stores the `SessionProvider`'s session update method to be able to
   * trigger session updates from places like `signIn` or `signOut`
   */
  _getSession: (...args: any[]) => any
}

export interface SessionProviderProps {
  children: JSX.Element
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

export interface UseSessionOptions<R extends boolean> {
  required: R
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void
}
