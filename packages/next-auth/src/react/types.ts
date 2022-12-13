import type { Session } from ".."
import type { BuiltInProviderType, ProviderType } from "../providers"
import type { LiteralUnion } from 'next-auth-core'

export interface UseSessionOptions<R extends boolean> {
  required: R
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void
}

export interface ClientSafeProvider {
  id: LiteralUnion<BuiltInProviderType>
  name: string
  type: ProviderType
  signinUrl: string
  callbackUrl: string
}

/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1) */
export interface SignOutResponse {
  url: string
}

/** [Documentation](https://next-auth.js.org/getting-started/client#options) */
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
  /**
   * Set to `false` to stop polling when the device has no internet access offline (determined by `navigator.onLine`)
   *
   * [`navigator.onLine` documentation](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
   */
  refetchWhenOffline?: false
}
