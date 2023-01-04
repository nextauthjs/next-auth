// @@jsxRuntime automatic
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"
import { Session } from "@auth/core/types"
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js"
import {
  UseSessionOptions,
  SignOutParams,
  SignInOptions,
  LiteralUnion,
  SignInAuthorizationParams,
  AuthClientConfig,
  SessionProviderProps,
} from "./types"
import { now, objectIsSession, parseUrl } from "./utils"

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
const __NEXTAUTH: AuthClientConfig = {
  baseUrl: parseUrl(process.env.AUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.AUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.AUTH_URL_INTERNAL ??
      process.env.AUTH_URL ??
      process.env.VERCEL_URL
  ).origin,
  basePathServer: parseUrl(
    process.env.AUTH_URL_INTERNAL ?? process.env.AUTH_URL
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {},
}

export type SessionContextInner<R extends boolean = false> = R extends true
  ?
      | { data: Session; status: "authenticated" }
      | { data: null; status: "loading" }
  :
      | { data: Session; status: "authenticated" }
      | { data: null; status: "unauthenticated" | "loading" }
export type SessionContextValue<R extends boolean = false> = Accessor<
  SessionContextInner<R>
>

export const SessionContext = createContext<SessionContextValue | undefined>(
  undefined
)

/**
 * React Hook that gives you access
 * to the logged in user's session data.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#usesession)
 */

export function useSession<R extends boolean>(
  options?: UseSessionOptions<R>
): Accessor<SessionContextInner<R>> {
  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue<R> = useContext(SessionContext)
  if (!value && (import.meta as any).env.DEV) {
    throw new Error(
      "[solid-auth]: `useSession` must be wrapped in a <SessionProvider />"
    )
  }

  const { required, onUnauthenticated } = options ?? {}

  const requiredAndNotLoading = required && value().status === "unauthenticated"

  createEffect(() => {
    if (requiredAndNotLoading) {
      const url = `/api/auth/signin?${new URLSearchParams({
        error: "SessionRequired",
        callbackUrl: window.location.href,
      })}`
      if (onUnauthenticated) onUnauthenticated()
      else window.location.href = url
    }
  })

  if (requiredAndNotLoading) {
    return createMemo(() => ({ data: value().data, status: "loading" } as any))
  }

  return value
}

/**
 * Provider to wrap the app in to make session data available globally.
 * Can also be used to throttle the number of requests to the endpoint
 * `/api/auth/session`.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#sessionprovider)
 */
export function SessionProvider(props: SessionProviderProps) {
  const { basePath, refetchInterval } = props
  if (basePath) __NEXTAUTH.basePath = basePath
  /**
   * If session was `null`, there was an attempt to fetch it,
   * but it failed, but we still treat it as a valid initial value.
   */
  const hasInitialSession = props.session !== undefined

  /** If session was passed, initialize as already synced */
  __NEXTAUTH._lastSync = hasInitialSession ? now() : 0

  const [session, setSession] = createSignal(
    (() => {
      if (hasInitialSession) __NEXTAUTH._session = props.session
      return props.session
    })()
  )

  /** If session was passed, initialize as not loading */
  const [loading, setLoading] = createSignal(!hasInitialSession)

  createEffect(() => {
    __NEXTAUTH._getSession = async ({ event } = {}) => {
      try {
        const storageEvent = event === "storage"
        // We should always update if we don't have a client session yet
        // or if there are events from other tabs/windows
        if (storageEvent || __NEXTAUTH._session === undefined) {
          __NEXTAUTH._lastSync = now()
          __NEXTAUTH._session = await getSession()
          setSession(__NEXTAUTH._session)
          return
        }

        if (
          // If there is no time defined for when a session should be considered
          // stale, then it's okay to use the value we have until an event is
          // triggered which updates it
          !event ||
          // If the client doesn't have a session then we don't need to call
          // the server to check if it does (if they have signed in via another
          // tab or window that will come through as a "stroage" event
          // event anyway)
          __NEXTAUTH._session === null ||
          // Bail out early if the client session is not stale yet
          now() < __NEXTAUTH._lastSync
        ) {
          return
        }

        // An event or session staleness occurred, update the client session.
        __NEXTAUTH._lastSync = now()
        __NEXTAUTH._session = await getSession()
        setSession(__NEXTAUTH._session)
      } finally {
        setLoading(false)
      }
    }

    __NEXTAUTH._getSession()

    onCleanup(() => {
      __NEXTAUTH._lastSync = 0
      __NEXTAUTH._session = undefined
      __NEXTAUTH._getSession = () => {}
    })
  })

  createEffect(() => {
    const { refetchOnWindowFocus = true } = props
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session, but only if
    // this feature is not disabled.
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible")
        __NEXTAUTH._getSession({ event: "visibilitychange" })
    }
    document.addEventListener("visibilitychange", visibilityHandler, false)
    onCleanup(() =>
      document.removeEventListener("visibilitychange", visibilityHandler, false)
    )
  })

  createEffect(() => {
    if (refetchInterval) {
      const refetchIntervalTimer = setInterval(() => {
        if (__NEXTAUTH._session) {
          __NEXTAUTH._getSession({ event: "poll" })
        }
      }, refetchInterval * 1000)
      onCleanup(() => clearInterval(refetchIntervalTimer))
    }
  })

  const value: any = createMemo(() => ({
    data: session(),
    status: loading()
      ? "loading"
      : session()
      ? "authenticated"
      : "unauthenticated",
  }))

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  )
}

/**
 * Client-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signin)
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined
>(
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
) {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  // TODO: Support custom providers
  const isCredentials = providerId === "credentials"
  const isEmail = providerId === "email"
  const isSupportingReturn = isCredentials || isEmail

  // TODO: Handle custom base path
  const signInUrl = `/api/auth/${
    isCredentials ? "callback" : "signin"
  }/${providerId}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  // TODO: Handle custom base path
  const csrfTokenResponse = await fetch("/api/auth/csrf")
  const { csrfToken } = await csrfTokenResponse.json()

  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    // @ts-expect-error -- ignore
    body: new URLSearchParams({
      ...options,
      csrfToken,
      callbackUrl,
    }),
  })

  const data = await res.clone().json()
  if (redirect || !isSupportingReturn) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? data.redirect ?? callbackUrl
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes("#")) window.location.reload()
    return
  }
  if (res.ok) {
    await __NEXTAUTH._getSession({ event: "storage" })
  }
  return res
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export async function signOut(options?: SignOutParams) {
  const { callbackUrl = window.location.href } = options ?? {}
  // TODO: Custom base path
  const csrfTokenResponse = await fetch("/api/auth/csrf")
  const { csrfToken } = await csrfTokenResponse.json()
  const res = await fetch(`/api/auth/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({
      csrfToken,
      callbackUrl,
    }),
  })
  const data = await res.json()
  if (options?.redirect ?? true) {
    const url = data.url ?? data.redirect ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
  }
  await __NEXTAUTH._getSession({ event: "storage" })
}

export async function getSession(): Promise<Session | null> {
  const res = await fetch("/api/auth/session")
  const data = await res.json()
  if (objectIsSession(data)) {
    return data
  }
  return null
}
