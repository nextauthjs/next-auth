/**
 *
 * NextAuth.js is the official integration of Auth.js for Next.js applications. It supports both
 * [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) and the
 * [Pages Router](https://nextjs.org/docs/pages). It includes methods for signing in, signing out, hooks, and a React
 * Context provider to wrap your application and make session data available anywhere.
 *
 * For use in [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions), check out [these methods](https://authjs.dev/guides/upgrade-to-v5#methods)
 *
 * @module react
 */

"use client"

import * as React from "react"
import {
  apiBaseUrl,
  ClientSessionError,
  fetchData,
  now,
  parseUrl,
  useOnline,
} from "./lib/client.js"

import type { ProviderId } from "@auth/core/providers"
import type { LoggerInstance, Session } from "@auth/core/types"
import type {
  AuthClientConfig,
  ClientSafeProvider,
  SessionProviderProps,
  SignInAuthorizationParams,
  SignInOptions,
  SignInResponse,
  SignOutParams,
  SignOutResponse,
  UseSessionOptions,
} from "./lib/client.js"

// TODO: Remove/move to core?
export type {
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
  SignInResponse,
}

export { SessionProviderProps }
// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
export const __NEXTAUTH: AuthClientConfig = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL ?? process.env.VERCEL_URL).origin,
  basePath: parseUrl(process.env.NEXTAUTH_URL).path,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ??
      process.env.NEXTAUTH_URL ??
      process.env.VERCEL_URL
  ).origin,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL
  ).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {},
}

let broadcastChannel: BroadcastChannel | null = null

function getNewBroadcastChannel() {
  return new BroadcastChannel("next-auth")
}

function broadcast() {
  if (typeof BroadcastChannel === "undefined") {
    return {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }

  if (broadcastChannel === null) {
    broadcastChannel = getNewBroadcastChannel()
  }

  return broadcastChannel
}

// TODO:
const logger: LoggerInstance = {
  debug: console.debug,
  error: console.error,
  warn: console.warn,
}

/** @todo Document */
export type UpdateSession = (data?: any) => Promise<Session | null>

/**
 * useSession() returns an object containing three things: a method called {@link UpdateSession|update}, `data` and `status`.
 */
export type SessionContextValue<R extends boolean = false> = R extends true
  ?
      | { update: UpdateSession; data: Session; status: "authenticated" }
      | { update: UpdateSession; data: null; status: "loading" }
  :
      | { update: UpdateSession; data: Session; status: "authenticated" }
      | {
          update: UpdateSession
          data: null
          status: "unauthenticated" | "loading"
        }

export const SessionContext = React.createContext?.<
  SessionContextValue | undefined
>(undefined)

/**
 * React Hook that gives you access to the logged in user's session data and lets you modify it.
 *
 * :::info
 * `useSession` is for client-side use only and when using [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router) you should prefer the `auth()` export.
 * :::
 */
export function useSession<R extends boolean>(
  options?: UseSessionOptions<R>
): SessionContextValue<R> {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components")
  }

  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue<R> = React.useContext(SessionContext)
  if (!value && process.env.NODE_ENV !== "production") {
    throw new Error(
      "[next-auth]: `useSession` must be wrapped in a <SessionProvider />"
    )
  }

  const { required, onUnauthenticated } = options ?? {}

  const requiredAndNotLoading = required && value.status === "unauthenticated"

  React.useEffect(() => {
    if (requiredAndNotLoading) {
      const url = `${__NEXTAUTH.basePath}/signin?${new URLSearchParams({
        error: "SessionRequired",
        callbackUrl: window.location.href,
      })}`
      if (onUnauthenticated) onUnauthenticated()
      else window.location.href = url
    }
  }, [requiredAndNotLoading, onUnauthenticated])

  if (requiredAndNotLoading) {
    return {
      data: value.data,
      update: value.update,
      status: "loading",
    }
  }

  return value
}

export interface GetSessionParams {
  event?: "storage" | "timer" | "hidden" | string
  triggerEvent?: boolean
  broadcast?: boolean
}

export async function getSession(params?: GetSessionParams) {
  const session = await fetchData<Session>(
    "session",
    __NEXTAUTH,
    logger,
    params
  )
  if (params?.broadcast ?? true) {
    const broadcastChannel = getNewBroadcastChannel()
    broadcastChannel.postMessage({
      event: "session",
      data: { trigger: "getSession" },
    })
  }
  return session
}

/**
 * Returns the current Cross-Site Request Forgery Token (CSRF Token)
 * required to make requests that changes state. (e.g. signing in or out, or updating the session).
 *
 * [CSRF Prevention: Double Submit Cookie](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie)
 */
export async function getCsrfToken() {
  const response = await fetchData<{ csrfToken: string }>(
    "csrf",
    __NEXTAUTH,
    logger
  )
  return response?.csrfToken ?? ""
}

export async function getProviders() {
  return fetchData<Record<ProviderId, ClientSafeProvider>>(
    "providers",
    __NEXTAUTH,
    logger
  )
}

/**
 * Initiates a signin flow or sends the user to the signin page listing all possible providers.
 * Handles CSRF protection.
 *
 * @note This method can only be used from Client Components ("use client" or Pages Router).
 * For Server Actions, use the `signIn` method imported from the `auth` config.
 */
export async function signIn(
  provider?: ProviderId,
  options?: SignInOptions<true>,
  authorizationParams?: SignInAuthorizationParams
): Promise<void>
export async function signIn(
  provider?: ProviderId,
  options?: SignInOptions<false>,
  authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse>
export async function signIn<Redirect extends boolean = true>(
  provider?: ProviderId,
  options?: SignInOptions<Redirect>,
  authorizationParams?: SignInAuthorizationParams
): Promise<SignInResponse | void> {
  const { callbackUrl, ...rest } = options ?? {}
  const {
    redirect = true,
    redirectTo = callbackUrl ?? window.location.href,
    ...signInParams
  } = rest

  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const providers = await getProviders()

  if (!providers) {
    const url = `${baseUrl}/error`
    window.location.href = url
    return // TODO: Return error if `redirect: false`
  }

  if (!provider || !providers[provider]) {
    const url = `${baseUrl}/signin?${new URLSearchParams({
      callbackUrl: redirectTo,
    })}`
    window.location.href = url
    return // TODO: Return error if `redirect: false`
  }

  const providerType = providers[provider].type

  if (providerType === "webauthn") {
    // TODO: Add docs link with explanation
    throw new TypeError(
      [
        `Provider id "${provider}" refers to a WebAuthn provider.`,
        'Please use `import { signIn } from "next-auth/webauthn"` instead.',
      ].join("\n")
    )
  }

  const signInUrl = `${baseUrl}/${
    providerType === "credentials" ? "callback" : "signin"
  }/${provider}`

  const csrfToken = await getCsrfToken()
  const res = await fetch(
    `${signInUrl}?${new URLSearchParams(authorizationParams)}`,
    {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Auth-Return-Redirect": "1",
      },
      body: new URLSearchParams({
        ...signInParams,
        csrfToken,
        callbackUrl: redirectTo,
      }),
    }
  )

  const data = await res.json()

  if (redirect) {
    const url = data.url ?? redirectTo
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    return
  }

  const error = new URL(data.url).searchParams.get("error") ?? undefined
  const code = new URL(data.url).searchParams.get("code") ?? undefined

  if (res.ok) {
    await __NEXTAUTH._getSession({ event: "storage" })
  }

  return {
    error,
    code,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  }
}

/**
 * Initiate a signout, by destroying the current session.
 * Handles CSRF protection.
 *
 * @note This method can only be used from Client Components ("use client" or Pages Router).
 * For Server Actions, use the `signOut` method imported from the `auth` config.
 */
export async function signOut(options?: SignOutParams<true>): Promise<void>
export async function signOut(
  options?: SignOutParams<false>
): Promise<SignOutResponse>
export async function signOut<R extends boolean = true>(
  options?: SignOutParams<R>
): Promise<SignOutResponse | void> {
  const {
    redirect = true,
    redirectTo = options?.callbackUrl ?? window.location.href,
  } = options ?? {}

  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const csrfToken = await getCsrfToken()
  const res = await fetch(`${baseUrl}/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({ csrfToken, callbackUrl: redirectTo }),
  })
  const data = await res.json()

  broadcast().postMessage({ event: "session", data: { trigger: "signout" } })

  if (redirect) {
    const url = data.url ?? redirectTo
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    return
  }

  await __NEXTAUTH._getSession({ event: "storage" })

  return data
}

/**
 * [React Context](https://react.dev/learn/passing-data-deeply-with-context) provider to wrap the app (`pages/`) to make session data available anywhere.
 *
 * When used, the session state is automatically synchronized across all open tabs/windows and they are all updated whenever they gain or lose focus
 * or the state changes (e.g. a user signs in or out) when {@link SessionProviderProps.refetchOnWindowFocus} is `true`.
 *
 * :::info
 * `SessionProvider` is for client-side use only and when using [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router) you should prefer the `auth()` export.
 * :::
 */
export function SessionProvider(props: SessionProviderProps) {
  if (!SessionContext) {
    throw new Error("React Context is unavailable in Server Components")
  }

  const { children, basePath, refetchInterval, refetchWhenOffline } = props

  if (basePath) __NEXTAUTH.basePath = basePath

  /**
   * If session was `null`, there was an attempt to fetch it,
   * but it failed, but we still treat it as a valid initial value.
   */
  const hasInitialSession = props.session !== undefined

  /** If session was passed, initialize as already synced */
  __NEXTAUTH._lastSync = hasInitialSession ? now() : 0

  const [session, setSession] = React.useState(() => {
    if (hasInitialSession) __NEXTAUTH._session = props.session
    return props.session
  })

  /** If session was passed, initialize as not loading */
  const [loading, setLoading] = React.useState(!hasInitialSession)

  React.useEffect(() => {
    __NEXTAUTH._getSession = async ({ event } = {}) => {
      try {
        const storageEvent = event === "storage"
        // We should always update if we don't have a client session yet
        // or if there are events from other tabs/windows
        if (storageEvent || __NEXTAUTH._session === undefined) {
          __NEXTAUTH._lastSync = now()
          __NEXTAUTH._session = await getSession({
            broadcast: !storageEvent,
          })
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
      } catch (error) {
        logger.error(
          new ClientSessionError((error as Error).message, error as any)
        )
      } finally {
        setLoading(false)
      }
    }

    __NEXTAUTH._getSession()

    return () => {
      __NEXTAUTH._lastSync = 0
      __NEXTAUTH._session = undefined
      __NEXTAUTH._getSession = () => {}
    }
  }, [])

  React.useEffect(() => {
    const handle = () => __NEXTAUTH._getSession({ event: "storage" })
    // Listen for storage events and update session if event fired from
    // another window (but suppress firing another event to avoid a loop)
    // Fetch new session data but tell it to not to fire another event to
    // avoid an infinite loop.
    // Note: We could pass session data through and do something like
    // `setData(message.data)` but that can cause problems depending
    // on how the session object is being used in the client; it is
    // more robust to have each window/tab fetch it's own copy of the
    // session object rather than share it across instances.
    broadcast().addEventListener("message", handle)
    return () => broadcast().removeEventListener("message", handle)
  }, [])

  React.useEffect(() => {
    const refetchOnWindowFocus = props.refetchOnWindowFocus ?? true
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session, but only if
    // this feature is not disabled.
    const visibilityHandler = () => {
      if (refetchOnWindowFocus && document.visibilityState === "visible")
        __NEXTAUTH._getSession({ event: "visibilitychange" })
    }
    document.addEventListener("visibilitychange", visibilityHandler, false)
    return () =>
      document.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [props.refetchOnWindowFocus])

  const isOnline = useOnline()
  // TODO: Flip this behavior in next major version
  const shouldRefetch = refetchWhenOffline !== false || isOnline

  React.useEffect(() => {
    if (refetchInterval && shouldRefetch) {
      const refetchIntervalTimer = setInterval(() => {
        if (__NEXTAUTH._session) {
          __NEXTAUTH._getSession({ event: "poll" })
        }
      }, refetchInterval * 1000)
      return () => clearInterval(refetchIntervalTimer)
    }
  }, [refetchInterval, shouldRefetch])

  const update = React.useCallback(
    async (data: any) => {
      if (loading) return
      setLoading(true)
      const newSession = await fetchData<Session>(
        "session",
        __NEXTAUTH,
        logger,
        typeof data === "undefined"
          ? undefined
          : { body: { csrfToken: await getCsrfToken(), data } }
      )
      setLoading(false)
      if (newSession) {
        setSession(newSession)
        broadcast().postMessage({
          event: "session",
          data: { trigger: "getSession" },
        })
      }
      return newSession
    },
    [loading]
  )

  const value: any = React.useMemo(
    () => ({
      data: session,
      status: loading
        ? "loading"
        : session
          ? "authenticated"
          : "unauthenticated",
      update,
    }),
    [session, loading, update]
  )

  return (
    // @ts-expect-error
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
