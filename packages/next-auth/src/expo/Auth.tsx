// Note about signIn() and signOut() methods:
//
// On signIn() and signOut() we pass 'json: true' to request a response in JSON
// instead of HTTP as redirect URLs on other domains are not returned to
// requests made using the fetch API in the browser, and we need to ask the API
// to return the response as a JSON object (the end point still defaults to
// returning an HTTP response with a redirect for non-JavaScript clients).
//
// We use HTTP POST requests with CSRF Tokens to protect against CSRF attacks.

import { Session } from ".."
import { NextAuthClientConfig, now } from "../client/_utils"
import _logger, { LoggerInstance, proxyLogger } from "../utils/logger"
import parseUrl from "../utils/parse-url"
import * as React from "react"
import "react-native-url-polyfill/auto"

import type {
  ClientSafeProvider,
  LiteralUnion,
  SessionProviderProps,
  SignInOptions,
  SignInResponse,
  SignOutParams,
  UseSessionOptions,
} from "./types"

import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "../providers"

import * as SecureStore from "expo-secure-store"
import Constants from "expo-constants"
import { Alert } from "react-native"
import { defaultCookies } from "../core/lib/cookie"
import * as AuthSession from "expo-auth-session"

const storageKeys = {
  sessionToken: "next-auth.sessionToken",
  csrfToken: "next-auth.csrfToken",
}

export async function fetchData<T = any>(
  path: string,
  __NEXTAUTH: NextAuthClientConfig,
  logger: LoggerInstance,
  params?: Record<string, any>
): Promise<T | null> {
  const url = `${apiBaseUrl(__NEXTAUTH)}/proxy`
  const sessionToken = await SecureStore.getItemAsync(storageKeys.sessionToken)
  try {
    let csrfToken = await SecureStore.getItemAsync(storageKeys.csrfToken)
    if (!csrfToken) {
      csrfToken = (await getCsrfToken())?.csrfTokenCookie ?? null
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: path,
        sessionToken,
        csrfToken,
        ...params,
      }), // TODO: populate this
    }
    const res = await fetch(url, options)
    const data = await res.json()
    if (!res.ok) throw data
    return Object.keys(data).length > 0 ? data : null // Return null if data empty
  } catch (error) {
    logger.error("CLIENT_FETCH_ERROR", { error: error as Error, url })
    return null
  }
}

export async function getSignInInfo({
  provider,
  proxyRedirectUri,
}: {
  provider: string
  proxyRedirectUri: string
}) {
  return await fetchData<{
    state: string
    stateEncrypted: string
    csrfTokenCookie: string
    codeVerifier: string
    codeChallenge: string
    clientId: string
  }>("proxy", __NEXTAUTH, logger, {
    action: "signin",
    providerId: provider,
    callbackUrl: proxyRedirectUri,
  })
}

export function apiBaseUrl(__NEXTAUTH: NextAuthClientConfig) {
  return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`
}

const nextAuthUrl = Constants.manifest?.extra?.nextAuthUrl

const __NEXTAUTH: NextAuthClientConfig = {
  baseUrl: parseUrl(nextAuthUrl).origin,
  basePath: parseUrl(nextAuthUrl).path,
  baseUrlServer: parseUrl(nextAuthUrl).origin,
  basePathServer: parseUrl(nextAuthUrl).path,
  _lastSync: 0,
  _session: undefined,
  _getSession: () => {},
}

const logger = proxyLogger(_logger, __NEXTAUTH.basePath)

export type SessionContextValue =
  | { data: Session; status: "authenticated" }
  | { data: null; status: "unauthenticated" | "loading" }

const SessionContext = React.createContext<SessionContextValue | undefined>(
  undefined
)

/**
 * React Hook that gives you access
 * to the logged in user's session data.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#usesession)
 */
export function useSession(options?: UseSessionOptions) {
  // @ts-expect-error Satisfy TS if branch on line below
  const value: SessionContextValue = React.useContext(SessionContext)
  if (!value && process.env.NODE_ENV !== "production") {
    throw new Error(
      "[next-auth]: `useSession` must be wrapped in a <SessionProvider />"
    )
  }

  const { onUnauthenticated } = options ?? {}

  const unauthenticated = value.status === "unauthenticated"

  React.useEffect(() => {
    if (unauthenticated) {
      if (onUnauthenticated) onUnauthenticated()
    }
  }, [unauthenticated, onUnauthenticated])

  return value
}

export async function getSession() {
  const session = await fetchData<Session>("session", __NEXTAUTH, logger)
  return session
}

const getCookieFromHeader = (name: string, headers: Headers) => {
  return headers
    .get("set-cookie")
    ?.split(", ")
    .filter((s) => s.startsWith(`${name}=`))[0]
    ?.split("=")[1]
    ?.split(";")[0]
}

export const authCookies = defaultCookies(
  // useSecureCookies ??
  __NEXTAUTH.baseUrl.startsWith("https://")
)

/**
 * Returns the current Cross Site Request Forgery Token (CSRF Token)
 * required to make POST requests (e.g. for signing in and signing out).
 * You likely only need to use this if you are not using the built-in
 * `signIn()` and `signOut()` methods.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getcsrftoken)
 */
export async function getCsrfToken() {
  const csrfTokenRes = await fetch(`${apiBaseUrl(__NEXTAUTH)}/csrf`)
  const csrfToken = (await csrfTokenRes.json()).csrfToken
  const csrfTokenCookie = getCookieFromHeader(
    authCookies.csrfToken.name,
    csrfTokenRes.headers
  ) as string
  console.log("debug getCsrfToken", { csrfToken, csrfTokenCookie })
  // const { csrfToken, csrfTokenCookie } = await trpcClient.query("auth.csrf")

  // await SafeStorage.set(storageKeys.csrfToken, csrfTokenCookie)

  return {
    csrfToken,
    csrfTokenCookie,
  }
}

/**
 * It calls `/api/auth/providers` and returns
 * a list of the currently configured authentication providers.
 * It can be useful if you are creating a dynamic custom sign in page.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#getproviders)
 */
export async function getProviders() {
  return await fetchData<
    Record<LiteralUnion<BuiltInProviderType>, ClientSafeProvider>
  >("providers", __NEXTAUTH, logger)
}

export interface SigninResult {
  result: AuthSession.AuthSessionResult
  state: string
  csrfTokenCookie: string
  stateEncrypted: string
  codeVerifier?: string
  proxyRedirectUri: string
  provider: string
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
  provider: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  initiateExpoAuthFlow: () => Promise<SigninResult>,
  options?: SignInOptions // TODO: use this
): Promise<
  P extends RedirectableProviderType ? SignInResponse | undefined : undefined
> {
  const providers = await getProviders()
  if (!providers) {
    Alert.alert("Error", "Provider not valid.")
    return
  }
  if (!provider || !(provider in providers)) {
    Alert.alert("Error", "Provider not valid.")
    return
  }

  const signinResult = await initiateExpoAuthFlow()
  const {
    result,
    state,
    codeVerifier,
    csrfTokenCookie,
    // proxyRedirectUri,
    stateEncrypted,
    provider: nativeProvider,
  } = signinResult

  if (result.type !== "success") return // TODO: handle other results

  const data = await fetchData<{ error?: string; sessionToken?: string }>(
    "callback",
    __NEXTAUTH,
    logger,
    {
      providerId: nativeProvider,
      code: result.params.code,
      csrfToken: csrfTokenCookie,
      state,
      stateEncrypted,
      // callbackUrl: proxyRedirectUri,
      codeVerifier,
    }
  )
  console.log("next-auth/expo callback data", data)
  if (!data) {
    Alert.alert("Error", "Callback error.")
    return
  }
  const { error, sessionToken } = data
  if (!!error || !sessionToken) {
    switch (error) {
      case "OAuthAccountNotLinked": {
        Alert.alert(
          "Error",
          "The email associated with the account you just logged in is being used by another account. Please log into that account and then link to other providers afterwards."
        )
        break
      }
    }
    return
  }
  console.log("sessionToken received in Client", sessionToken)
  if (sessionToken) {
    await SecureStore.setItemAsync(storageKeys.sessionToken, sessionToken)
    await __NEXTAUTH._getSession({ event: "storage" })
  }
}

/**
 * Signs the user out, by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#signout)
 */
export async function signOut<R extends boolean = true>(
  options?: SignOutParams<R>
): Promise<void> {
  const sessionToken = await SecureStore.getItemAsync(storageKeys.sessionToken)
  if (!sessionToken) throw new Error("No sessionToken")

  let csrfToken = await SecureStore.getItemAsync(storageKeys.csrfToken)
  if (!csrfToken) {
    csrfToken = (await getCsrfToken())?.csrfTokenCookie ?? null
  }

  const data = await fetchData("signout", __NEXTAUTH, logger, {
    csrfToken,
    sessionToken,
  })

  console.log("debug signOut", data)
  if (data) {
    await SecureStore.deleteItemAsync(storageKeys.sessionToken)

    // Trigger session refetch to update AuthContext state.
    await __NEXTAUTH._getSession({ event: "storage" })
  }
}

/**
 * Provider to wrap the app in to make session data available globally.
 * Can also be used to throttle the number of requests to the endpoint
 * `/api/auth/session`.
 *
 * [Documentation](https://next-auth.js.org/getting-started/client#sessionprovider)
 */
export function SessionProvider(props: SessionProviderProps) {
  const { children, basePath, refetchInterval } = props

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
      } catch (error) {
        logger.error("CLIENT_SESSION_ERROR", error as Error)
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const { refetchOnWindowFocus = true } = props
  //     // Listen for when the page is visible, if the user switches tabs
  //     // and makes our tab visible again, re-fetch the session, but only if
  //     // this feature is not disabled.
  //     if (refetchOnWindowFocus)
  //       __NEXTAUTH._getSession({ event: "visibilitychange" })
  //   }, [props])
  // )

  React.useEffect(() => {
    // Set up polling
    if (refetchInterval) {
      const refetchIntervalTimer = setInterval(() => {
        if (__NEXTAUTH._session) {
          __NEXTAUTH._getSession({ event: "poll" })
        }
      }, refetchInterval * 1000)
      return () => clearInterval(refetchIntervalTimer)
    }
  }, [refetchInterval])

  const value: any = React.useMemo(
    () => ({
      data: session,
      status: loading
        ? "loading"
        : session
        ? "authenticated"
        : "unauthenticated",
    }),
    [session, loading]
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
