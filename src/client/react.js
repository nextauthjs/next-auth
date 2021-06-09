// Note about signIn() and signOut() methods:
//
// On signIn() and signOut() we pass 'json: true' to request a response in JSON
// instead of HTTP as redirect URLs on other domains are not returned to
// requests made using the fetch API in the browser, and we need to ask the API
// to return the response as a JSON object (the end point still defaults to
// returning an HTTP response with a redirect for non-JavaScript clients).
//
// We use HTTP POST requests with CSRF Tokens to protect against CSRF attacks.

import { useState, useEffect, useContext, createContext, useMemo } from "react"
import _logger, { proxyLogger } from "../lib/logger"
import parseUrl from "../lib/parse-url"

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
/** @type {import("types/internals/client").NextAuthConfig} */
const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePath: parseUrl(process.env.NEXTAUTH_URL).basePath,
  baseUrlServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL ||
      process.env.NEXTAUTH_URL ||
      process.env.VERCEL_URL
  ).baseUrl,
  basePathServer: parseUrl(
    process.env.NEXTAUTH_URL_INTERNAL || process.env.NEXTAUTH_URL
  ).basePath,
  pollInterval: 0,
  staleTime: 0,
  // Properties starting with _ are used for tracking internal app state
  _clientLastSync: 0,
  _clientSyncTimer: null,
  _eventListenersAdded: false,
  _clientSession: undefined,
  _getSession: () => {},
}

const broadcast = BroadcastChannel()

const logger = proxyLogger(_logger, __NEXTAUTH.basePath)

/** @type {import("types/internals/react").SessionContext} */
const SessionContext = createContext()

export function useSession() {
  return useContext(SessionContext)
}

export async function getSession(ctx) {
  const session = await _fetchData("session", ctx)
  if (ctx?.broadcast ?? true) {
    broadcast.post({ event: "session", data: { trigger: "getSession" } })
  }
  return session
}

export async function getCsrfToken(ctx) {
  const response = await _fetchData("csrf", ctx)
  return response?.csrfToken
}

export async function getProviders() {
  return await _fetchData("providers")
}

export async function signIn(provider, options = {}, authorizationParams = {}) {
  const { callbackUrl = window.location.href, redirect = true } = options

  const baseUrl = _apiBaseUrl()
  const providers = await getProviders()

  if (!providers) {
    return window.location.replace(`${baseUrl}/error`)
  }

  if (!(provider in providers)) {
    return window.location.replace(
      `${baseUrl}/signin?${new URLSearchParams({ callbackUrl })}`
    )
  }

  const isCredentials = providers[provider].type === "credentials"
  const isEmail = providers[provider].type === "email"
  const isSupportingReturn = isCredentials || isEmail

  const signInUrl = `${baseUrl}/${
    isCredentials ? "callback" : "signin"
  }/${provider}`

  const _signInUrl = `${signInUrl}?${new URLSearchParams(authorizationParams)}`

  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  })

  const data = await res.json()

  if (redirect || !isSupportingReturn) {
    const url = data.url ?? callbackUrl
    window.location.replace(url)
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
  }
}

export async function signOut(options = {}) {
  const { callbackUrl = window.location.href, redirect = true } = options
  const baseUrl = _apiBaseUrl()
  const fetchOptions = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  }
  const res = await fetch(`${baseUrl}/signout`, fetchOptions)
  const data = await res.json()
  broadcast.post({ event: "session", data: { trigger: "signout" } })

  if (redirect) {
    const url = data.url ?? callbackUrl
    window.location.replace(url)
    // If url contains a hash, the browser does not reload the page. We reload manually
    if (url.includes("#")) window.location.reload()
    return
  }

  await __NEXTAUTH._getSession({ event: "storage" })

  return data
}

function setOptions(options = {}) {
  const { baseUrl, basePath, staleTime, pollInterval } = options
  if (baseUrl) __NEXTAUTH.baseUrl = baseUrl
  if (basePath) __NEXTAUTH.basePath = basePath
  if (staleTime) __NEXTAUTH.staleTime = staleTime
  if (pollInterval) __NEXTAUTH.pollInterval = pollInterval
}

export function SessionProvider({ children, session, options }) {
  useEffect(() => {
    setOptions(options)
  }, [options])

  const [data, setData] = useState(session)
  const [loading, setLoading] = useState(!session)

  useEffect(() => {
    __NEXTAUTH._getSession = async ({ event } = {}) => {
      try {
        // Events from other tabs/windows or
        // if we don't have a client session should always update.
        if (event === "storage" || __NEXTAUTH._clientSession === undefined) {
          __NEXTAUTH._clientLastSync = _now()
          __NEXTAUTH._clientSession = await getSession({ broadcast: false })
          setData(__NEXTAUTH._clientSession)
          return
        }

        const staleTime = __NEXTAUTH.staleTime
        if (
          // If there is no time defined for when a session should be considered
          // stale, then it's okay to use the value we have until an event is
          // triggered which updates it.
          (staleTime === 0 && !event) ||
          // If the client doesn't have a session then we don't need to call
          // the server to check if it does (if they have signed in via another
          // tab or window that will come through as a "stroage" event
          // event and will skip this logic)
          (staleTime > 0 && __NEXTAUTH._clientSession === null) ||
          // If the session freshness is within staleTime then don't request
          // it again on this call (avoids too many invokations).
          (staleTime > 0 && _now() < __NEXTAUTH.clientLastSync + staleTime)
        ) {
          return
        }

        __NEXTAUTH._clientLastSync = _now()
        __NEXTAUTH._clientSession = await getSession({
          broadcast: event !== "storage",
        })
        setData(__NEXTAUTH._clientSession)
      } catch (error) {
        logger.error("CLIENT_SESSION_ERROR", error)
      } finally {
        setLoading(false)
      }
    }

    __NEXTAUTH._getSession()
  }, [])

  useEffect(() => {
    // Listen for storage events and update session if event fired from
    // another window (but suppress firing another event to avoid a loop)
    // Fetch new session data but tell it to not to fire another event to
    // avoid an infinite loop.
    // Note: We could pass session data through and do something like
    // `setData(message.data)` but that can cause problems depending
    // on how the session object is being used in the client; it is
    // more robust to have each window/tab fetch it's own copy of the
    // session object rather than share it across instances.
    const unsubscribeBroadcast = broadcast.receive(
      async () => await __NEXTAUTH._getSession({ event: "storage" })
    )

    // Set up visibility change
    // Listen for document visibility change events and
    // if visibility of the document changes, re-fetch the session.
    const visibilityHandler = () => {
      !document.hidden && __NEXTAUTH._getSession({ event: "visibilitychange" })
    }
    document.addEventListener("visibilitychange", visibilityHandler, false)

    // Set up polling
    if (__NEXTAUTH.pollInterval) {
      __NEXTAUTH._clientSyncTimer = setTimeout(async () => {
        if (__NEXTAUTH._clientSession) {
          await __NEXTAUTH._getSession({ event: "timer" })
        }
      }, __NEXTAUTH.pollInterval * 1000)
    }

    return () => {
      unsubscribeBroadcast()
      document.removeEventListener("visibilitychange", visibilityHandler, false)
      if (__NEXTAUTH.pollInterval) {
        clearTimeout(__NEXTAUTH._clientSyncTimer)
      }
    }
  }, [])

  const value = useMemo(() => [data, loading], [data, loading])

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

/**
 * If passed 'appContext' via getInitialProps() in _app.js
 * then get the req object from ctx and use that for the
 * req value to allow _fetchData to
 * work seemlessly in getInitialProps() on server side
 * pages *and* in _app.js.
 */
async function _fetchData(path, { ctx, req = ctx?.req } = {}) {
  try {
    const baseUrl = await _apiBaseUrl()
    const options = req ? { headers: { cookie: req.headers.cookie } } : {}
    const res = await fetch(`${baseUrl}/${path}`, options)
    const data = await res.json()
    if (!res.ok) throw data
    return Object.keys(data).length > 0 ? data : null // Return null if data empty
  } catch (error) {
    logger.error("CLIENT_FETCH_ERROR", path, error)
    return null
  }
}

function _apiBaseUrl() {
  if (typeof window === "undefined") {
    // NEXTAUTH_URL should always be set explicitly to support server side calls - log warning if not set
    if (!process.env.NEXTAUTH_URL) {
      logger.warn("NEXTAUTH_URL", "NEXTAUTH_URL environment variable not set")
    }

    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrlServer}${__NEXTAUTH.basePathServer}`
  }
  // Return relative path when called client side
  return __NEXTAUTH.basePath
}

/** Returns the number of seconds elapsed since January 1, 1970 00:00:00 UTC. */
function _now() {
  return Math.floor(Date.now() / 1000)
}

/**
 * Inspired by [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
 * Only not using it directly, because Safari does not support it.
 *
 * https://caniuse.com/?search=broadcastchannel
 */
function BroadcastChannel(name = "nextauth.message") {
  return {
    /**
     * Get notified by other tabs/windows.
     * @param {(message: import("types/internals/client").BroadcastMessage) => void} onReceive
     */
    receive(onReceive) {
      if (typeof window === "undefined") return
      const handler = (event) => {
        if (event.key !== name) return
        /** @type {import("types/internals/client").BroadcastMessage} */
        const message = JSON.parse(event.newValue)
        if (message?.event !== "session" || !message?.data) return

        onReceive(message)
      }
      window.addEventListener("storage", handler)
      return () => window.removeEventListener("storage", handler)
    },
    /** Notify other tabs/windows. */
    post(message) {
      if (typeof window === "undefined") return
      localStorage.setItem(
        name,
        JSON.stringify({ ...message, timestamp: _now() })
      )
    },
  }
}
