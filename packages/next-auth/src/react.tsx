/**
 *
 * NextAuth.js methods and components that work in [Client components](https://nextjs.org/docs/app/building-your-application/rendering/client-components) and the [Pages Router](https://nextjs.org/docs/pages).
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

import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"
import type { LoggerInstance, Session } from "@auth/core/types"
import type {
  AuthClientConfig,
  ClientSafeProvider,
  LiteralUnion,
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
  LiteralUnion,
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
const __NEXTAUTH: AuthClientConfig = {
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

function broadcast() {
  if (typeof BroadcastChannel !== "undefined") {
    return new BroadcastChannel("next-auth")
  }
  return {
    postMessage: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }
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
 * You will likely not need `useSession` if you are using the [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router).
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
      const url = `/api/auth/signin?${new URLSearchParams({
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
    broadcast().postMessage({
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

type ProvidersType = Record<
  LiteralUnion<BuiltInProviderType>,
  ClientSafeProvider
>

/**
 * Returns a client-safe configuration object of the currently
 * available providers.
 */
export async function getProviders() {
  return fetchData<ProvidersType>("providers", __NEXTAUTH, logger)
}

/**
 * Initiate a signin flow or send the user to the signin page listing all possible providers.
 * Handles CSRF protection.
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined,
>(
  provider?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
): Promise<
  P extends RedirectableProviderType ? SignInResponse | undefined : undefined
> {
  const { callbackUrl = window.location.href, redirect = true } = options ?? {}

  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const providers = await getProviders()

  if (!providers) {
    window.location.href = `${baseUrl}/error`
    return
  }

  if (!provider || !(provider in providers)) {
    window.location.href = `${baseUrl}/signin?${new URLSearchParams({
      callbackUrl,
    })}`
    return
  }

  const isCredentials = providers[provider].type === "credentials"
  const isEmail = providers[provider].type === "email"
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = `${baseUrl}/${
    isCredentials ? "callback" : "signin"
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
      // @ts-expect-error
      body: new URLSearchParams({ ...options, csrfToken, callbackUrl }),
    }
  )

  const data = await res.json()

  // TODO: Do not redirect for Credentials and Email providers by default in next major
  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    return
  }

  const error = new URL(data.url).searchParams.get("error")

  if (res.ok) {
    await __NEXTAUTH._getSession({ event: "storage" })
  }

  return {
    error,
    status: res.status,
    ok: res.ok,
    url: error ? null : data.url,
  } as any
}

/**
 * Initiate a signout, by destroying the current session.
 * Handles CSRF protection.
 */
export async function signOut<R extends boolean = true>(
  options?: SignOutParams<R>
): Promise<R extends true ? undefined : SignOutResponse> {
  const { callbackUrl = window.location.href } = options ?? {}
  const baseUrl = apiBaseUrl(__NEXTAUTH)
  const csrfToken = await getCsrfToken()
  const res = await fetch(`${baseUrl}/signout`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
    },
    body: new URLSearchParams({ csrfToken, callbackUrl }),
  })
  const data = await res.json()

  broadcast().postMessage({ event: "session", data: { trigger: "signout" } })

  if (options?.redirect ?? true) {
    const url = data.url ?? callbackUrl
    window.location.href = url
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    // @ts-expect-error
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
 * You will likely not need `SessionProvider` if you are using the [Next.js App Router (`app/`)](https://nextjs.org/blog/next-13-4#nextjs-app-router).
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
    const { refetchOnWindowFocus = true } = props
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

  const value: any = React.useMemo(
    () => ({
      data: session,
      status: loading
        ? "loading"
        : session
          ? "authenticated"
          : "unauthenticated",
      async update(data: any) {
        if (loading || !session) return
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
    }),
    [session, loading]
  )

  return (
    // @ts-expect-error
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
