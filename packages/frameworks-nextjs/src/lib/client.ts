"use client"

import * as React from "react"
import type { BuiltInProviderType, ProviderType } from "@auth/core/providers"
import type { LoggerInstance, Session } from "@auth/core/types"
import { AuthError } from "@auth/core/errors"

/** @todo */
class ClientFetchError extends AuthError {}

/** @todo */
export class ClientSessionError extends AuthError {}

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

export interface UseSessionOptions<R extends boolean> {
  required: R
  /** Defaults to `signIn` */
  onUnauthenticated?: () => void
}

// Util type that matches some strings literally, but allows any other string as well.
// @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
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
   * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
   *
   * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
   */
  callbackUrl?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
  redirect?: boolean
}

export interface SignInResponse {
  error: string | undefined
  status: number
  ok: boolean
  url: string | null
}

/**
 * Match `inputType` of `new URLSearchParams(inputType)`
 * @internal
 */
export type SignInAuthorizationParams =
  | string
  | string[][]
  | Record<string, string>
  | URLSearchParams

/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1) */
export interface SignOutResponse {
  url: string
}

export interface SignOutParams<R extends boolean = true> {
  /** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
  callbackUrl?: string
  /** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
  redirect?: R
}

/**
 
 * If you have session expiry times of 30 days (the default) or more, then you probably don't need to change any of the default options.
 *
 * However, if you need to customize the session behavior and/or are using short session expiry times, you can pass options to the provider to customize the behavior of the {@link useSession} hook.
 */
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

// ------------------------ Internal ------------------------

/**
 * If passed 'appContext' via getInitialProps() in _app.js
 * then get the req object from ctx and use that for the
 * req value to allow `fetchData` to
 * work seemlessly in getInitialProps() on server side
 * pages *and* in _app.js.
 * @internal
 */
export async function fetchData<T = any>(
  path: string,
  __NEXTAUTH: AuthClientConfig,
  logger: LoggerInstance,
  req: any = {}
): Promise<T | null> {
  const url = `${apiBaseUrl(__NEXTAUTH)}/${path}`
  try {
    const options: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(req?.headers?.cookie ? { cookie: req.headers.cookie } : {}),
      },
    }

    if (req?.body) {
      options.body = JSON.stringify(req.body)
      options.method = "POST"
    }

    const res = await fetch(url, options)
    const data = await res.json()
    if (!res.ok) throw data
    return data
  } catch (error) {
    logger.error(new ClientFetchError((error as Error).message, error as any))
    return null
  }
}

/** @internal */
export function apiBaseUrl(__NEXTAUTH: AuthClientConfig) {
  if (typeof window === "undefined") {
    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`
  }
  // Return relative path when called client side
  return __NEXTAUTH.basePath
}

/** @internal  */
export function useOnline() {
  const [isOnline, setIsOnline] = React.useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  )

  const setOnline = () => setIsOnline(true)
  const setOffline = () => setIsOnline(false)

  React.useEffect(() => {
    window.addEventListener("online", setOnline)
    window.addEventListener("offline", setOffline)

    return () => {
      window.removeEventListener("online", setOnline)
      window.removeEventListener("offline", setOffline)
    }
  }, [])

  return isOnline
}

/**
 * Returns the number of seconds elapsed since January 1, 1970 00:00:00 UTC.
 * @internal
 */
export function now() {
  return Math.floor(Date.now() / 1000)
}

/**
 * Returns an `URL` like object to make requests/redirects from server-side
 * @internal
 */
export function parseUrl(url?: string): {
  /** @default "http://localhost:3000" */
  origin: string
  /** @default "localhost:3000" */
  host: string
  /** @default "/api/auth" */
  path: string
  /** @default "http://localhost:3000/api/auth" */
  base: string
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string
} {
  const defaultUrl = new URL("http://localhost:3000/api/auth")

  if (url && !url.startsWith("http")) {
    url = `https://${url}`
  }

  const _url = new URL(url ?? defaultUrl)
  const path = (_url.pathname === "/" ? defaultUrl.pathname : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, "")

  const base = `${_url.origin}${path}`

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  }
}
