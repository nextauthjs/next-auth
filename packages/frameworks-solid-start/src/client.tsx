import type {
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
} from "@auth/core/types"
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
  AuthClientConfig,
  SessionProviderProps,
} from "./types"
import { now, objectIsSession, parseUrl } from "./utils"

const __SOLIDAUTH: AuthClientConfig = {
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

export function createSession<R extends boolean>(
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

  const requiredAndNotLoading = () =>
    required && value().status === "unauthenticated"

  createEffect(() => {
    if (requiredAndNotLoading()) {
      const url = `/api/auth/signin?${new URLSearchParams({
        error: "SessionRequired",
        callbackUrl: window.location.href,
      })}`
      if (onUnauthenticated) onUnauthenticated()
      else window.location.href = url
    }
  })

  if (requiredAndNotLoading()) {
    return () => ({ data: value().data, status: "loading" } as any)
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
  if (basePath) __SOLIDAUTH.basePath = basePath
  /**
   * If session was `null`, there was an attempt to fetch it,
   * but it failed, but we still treat it as a valid initial value.
   */
  const hasInitialSession = props.session !== undefined

  /** If session was passed, initialize as already synced */
  __SOLIDAUTH._lastSync = hasInitialSession ? now() : 0

  const [session, setSession] = createSignal(
    (() => {
      if (hasInitialSession) __SOLIDAUTH._session = props.session
      return props.session
    })()
  )

  /** If session was passed, initialize as not loading */
  const [loading, setLoading] = createSignal(!hasInitialSession)

  createEffect(() => {
    __SOLIDAUTH._getSession = async ({ event } = {}) => {
      try {
        const storageEvent = event === "storage"
        // We should always update if we don't have a client session yet
        // or if there are events from other tabs/windows
        if (storageEvent || __SOLIDAUTH._session === undefined) {
          __SOLIDAUTH._lastSync = now()
          __SOLIDAUTH._session = await getSession()
          setSession(__SOLIDAUTH._session)
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
          __SOLIDAUTH._session === null ||
          // Bail out early if the client session is not stale yet
          now() < __SOLIDAUTH._lastSync
        ) {
          return
        }

        // An event or session staleness occurred, update the client session.
        __SOLIDAUTH._lastSync = now()
        __SOLIDAUTH._session = await getSession()
        setSession(__SOLIDAUTH._session)
      } finally {
        setLoading(false)
      }
    }

    __SOLIDAUTH._getSession()

    onCleanup(() => {
      __SOLIDAUTH._lastSync = 0
      __SOLIDAUTH._session = undefined
      __SOLIDAUTH._getSession = () => {}
    })
  })

  createEffect(() => {
    const { refetchOnWindowFocus = true } = props
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session, but only if
    // this feature is not disabled.
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible")
        __SOLIDAUTH._getSession({ event: "visibilitychange" })
    }
    document.addEventListener("visibilitychange", visibilityHandler, false)
    onCleanup(() =>
      document.removeEventListener("visibilitychange", visibilityHandler, false)
    )
  })

  createEffect(() => {
    if (refetchInterval) {
      const refetchIntervalTimer = setInterval(() => {
        if (__SOLIDAUTH._session) {
          __SOLIDAUTH._getSession({ event: "poll" })
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
 * [Documentation](https://authjs.dev/reference/utilities/#signin)
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
  const { redirectTo = window.location.href, redirect = true } = options ?? {}

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
      callbackUrl: redirectTo,
    }),
  })

  const data = await res.json()
  if (redirect || !isSupportingReturn) {
    // TODO: Do not redirect for Credentials and Email providers by default in next major
    window.location.href = data.url ?? data.redirect ?? redirectTo
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (data.url.includes("#")) window.location.reload()
    return
  }
  const error = new URL(data.url).searchParams.get("error")
  if (res.ok) {
    await __SOLIDAUTH._getSession({ event: "storage" })
  }
  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as const
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://authjs.dev/reference/utilities/#signout)
 */
export async function signOut(
  options?: SignOutParams & { redirectTo?: string }
) {
  const { redirectTo = window.location.href, redirect } = options ?? {}
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
      callbackUrl: redirectTo,
    }),
  })
  const data = await res.json()
  if (redirect) {
    const url = data.url ?? data.redirect ?? redirectTo
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
  }
  await __SOLIDAUTH._getSession({ event: "storage" })
  return data
}

export async function getSession() {
  const res = await fetch(`/api/auth/session`)
  const data = await res.json()
  if (objectIsSession(data)) {
    return data
  }
  return null
}
