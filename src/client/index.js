/// Note: fetch() is built in to Next.js 9.4
//
// Note about signIn() and signOut() methods:
//
// On signIn() and signOut() we pass 'json: true' to request a response in JSON
// instead of HTTP as redirect URLs on other domains are not returned to
// requests made using the fetch API in the browser, and we need to ask the API
// to return the response as a JSON object (the end point still defaults to
// returning an HTTP response with a redirect for non-JavaScript clients).
//
// We use HTTP POST requests with CSRF Tokens to protect against CSRF attacks.

import * as React from 'react'
import logger from '../lib/logger'
import {
  __NEXTAUTH, _apiBaseUrl, _fetchData, _encodedForm, _sendMessage, setOptions
} from './utils'

/**
 * Universal method (client + server) to get the session.
 * If you need the session client side, you should probably use `useSession()`.
 *
 * When called server-side, you can pass either `ctx` or `req`.
 */
export async function getSession ({ req, ctx, triggerEvent = true } = {}) {
  // If passed 'appContext' via getInitialProps() in _app.js then get the req
  // object from ctx and use that for the req value to allow getSession() to
  // work seemlessly in getInitialProps() on server side pages *and* in _app.js.
  if (!req && ctx?.req) { req = ctx.req }

  const baseUrl = _apiBaseUrl()
  const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}
  const session = await _fetchData(`${baseUrl}/session`, fetchOptions)
  if (triggerEvent) {
    _sendMessage({ event: 'session', data: { trigger: 'getSession' } })
  }
  return session
}

/**
 * Universal method (client + server) to retrieve a CSRF token.
 *
 * Pass either `ctx` or `req`.
 * */
export async function getCsrfToken ({ req, ctx } = {}) {
  // If passed 'appContext' via getInitialProps() in _app.js then get the req
  // object from ctx and use that for the req value to allow getCsrfToken() to
  // work seemlessly in getInitialProps() on server side pages *and* in _app.js.
  if (!req && ctx?.req) { req = ctx.req }

  const baseUrl = _apiBaseUrl()
  const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}
  const data = await _fetchData(`${baseUrl}/csrf`, fetchOptions)
  return data?.csrfToken ?? null
}

/**
 *  Universal method (client + server) to get all the providers;
 *  does not require request headers.
 */
async function getProviders () {
  const baseUrl = _apiBaseUrl()
  return _fetchData(`${baseUrl}/providers`)
}

/**
 * Client-side function to sign the user in,
 * and optionally redirect them to somewhere else
 * afterwards.
 * @param {string} [provider] Which provider you want to log out from. Will redirect to the signin page, if omitted.
 * @param {{callbackUrl?: string, [key: string]: any}} params If callbackUrl not set, will redirect to the current location. All params are forwarded as the body of the request.
 * @example
 * ```jsx
 * <button onClick={() => signIn("auth0")}>
 *   Sign out
 * </button>
 * ```
 */
export async function signIn (provider, params = {}) {
  const baseUrl = _apiBaseUrl()
  const callbackUrl = params.callbackUrl ?? window.location
  const providers = await getProviders()

  // Redirect to sign in page if no valid provider specified
  if (!provider || !providers[provider]) {
    // If Provider not recognized, redirect to sign in page
    window.location = `${baseUrl}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
  } else {
    const signInUrl = (providers[provider].type === 'credentials')
      ? `${baseUrl}/callback/${provider}`
      : `${baseUrl}/signin/${provider}`

    // If is any other provider type, POST to provider URL with CSRF Token,
    // callback URL and any other parameters supplied.
    const data = await _fetchData(signInUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: _encodedForm({
        ...params,
        csrfToken: await getCsrfToken(),
        callbackUrl,
        json: true
      })
    })
    window.location = data?.url ?? callbackUrl
  }
}

/**
 * Client-side function to sign the user out,
 * and optionally redirect them to somewhere else
 * afterwards.
 *
 * If `callbackUrl` not set, will redirect to the current location
 * @param {{callbackUrl?: string}} params
 * @example
 * ```jsx
 * <button onClick={() => signOut({callbackUrl: "/you-are-logged-out"})}>
 *   Sign out
 * </button>
 * ```
 */
export async function signOut ({ callbackUrl = window.location } = {}) {
  const baseUrl = _apiBaseUrl()
  const data = await _fetchData(`${baseUrl}/signout`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: _encodedForm({
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true
    })
  })
  _sendMessage({ event: 'session', data: { trigger: 'signout' } })
  window.location = data?.url ?? callbackUrl
}

// React

// Context to store session data globally
export const _SessionContext = React.createContext()

/** React hook to get the session */
export function useSession () {
  return React.useContext(_SessionContext)
}

/** Provider to wrap the app in to make session data available globally */
export function SessionProvider ({ children, session, options }) {
  setOptions(options)
  const hasSession = !!session
  const [data, setData] = React.useState(session)
  const [loading, setLoading] = React.useState(() => !hasSession) // Start with loading=false, if we already have the session

  React.useEffect(() => {
    if (hasSession) { // Don't fetch session, if it is already in state
      return
    }
    const _getSession = async ({ event = null } = {}) => {
      try {
        const triggredByEvent = (event !== null)
        const triggeredByStorageEvent = !!((event && event === 'storage'))

        const clientMaxAge = __NEXTAUTH.clientMaxAge
        const clientLastSync = parseInt(__NEXTAUTH._clientLastSync)
        const currentTime = Math.floor(new Date().getTime() / 1000)
        const clientSession = __NEXTAUTH._clientSession

        // Updates triggered by a storage event *always* trigger an update and we
        // always update if we don't have any value for the current session state.
        if (triggeredByStorageEvent === false && clientSession !== undefined) {
          if (clientMaxAge === 0 && triggredByEvent !== true) {
            // If there is no time defined for when a session should be considered
            // stale, then it's okay to use the value we have until an event is
            // triggered which updates it.
            return
          } else if (clientMaxAge > 0 && clientSession === null) {
            // If the client doesn't have a session then we don't need to call
            // the server to check if it does (if they have signed in via another
            // tab or window that will come through as a triggeredByStorageEvent
            // event and will skip this logic)
            return
          } else if (clientMaxAge > 0 && currentTime < (clientLastSync + clientMaxAge)) {
            // If the session freshness is within clientMaxAge then don't request
            // it again on this call (avoids too many invokations).
            return
          }
        }

        if (clientSession === undefined) { __NEXTAUTH._clientSession = null }

        // Update clientLastSync before making response to avoid repeated
        // invokations that would otherwise be triggered while we are still
        // waiting for a response.
        __NEXTAUTH._clientLastSync = Math.floor(new Date().getTime() / 1000)

        // If this call was invoked via a storage event (i.e. another window) then
        // tell getSession not to trigger an event when it calls to avoid an
        // infinate loop.
        const triggerEvent = (triggeredByStorageEvent === false)
        const newClientSessionData = await getSession({ triggerEvent })

        // Save session state internally, just so we can track that we've checked
        // if a session exists at least once.
        __NEXTAUTH._clientSession = newClientSessionData

        setData(newClientSessionData)
        setLoading(false)
      } catch (error) {
        logger.error('CLIENT_USE_SESSION_ERROR', error)
      }
    }

    __NEXTAUTH._getSession = _getSession

    _getSession()
  }, [hasSession])

  return React.createElement(
    _SessionContext.Provider,
    { value: [data, loading] },
    children
  )
}

export default {
  // Deprecated/unsupported features.
  // Some methods are exported with more than one name. This provides some
  // flexibility over how they can be invoked and backwards compatibility
  // with earlier releases.
  Provider: SessionProvider,
  options: setOptions,
  session: getSession,
  providers: getProviders,
  csrfToken: getCsrfToken,
  signin: signIn,
  signout: signOut
}
