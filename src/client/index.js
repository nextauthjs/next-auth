// fetch() is built in to Next.js 9.4 (you can use a polyfill if using an older version)
/* global fetch:false */
import { useState, useEffect, useContext, createContext, createElement } from 'react'
import logger from '../lib/logger'

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
const __NEXTAUTH = {
  site: (typeof window === 'undefined')
    ? process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    : '',
  basePath: (typeof window === 'undefined')
    ? process.env.NEXTAUTH_BASE_PATH || '/api/auth'
    : '/api/auth',
  clientMaxAge: 0, // e.g. 0 == disabled, 60 == 60 seconds
  eventListenerAdded: false
}

// Method to set options. The documented way is to use the provider, but this
// method is being left in as an alternative, that will be helpful if/when we
// expose a vanilla JavaScript version that doesn't depend on React.
const setOptions = ({
  site,
  basePath,
  clientMaxAge
} = {}) => {
  if (site) { __NEXTAUTH.site = site }
  if (basePath) { __NEXTAUTH.basePath = basePath }
  if (clientMaxAge) { __NEXTAUTH.clientMaxAge = clientMaxAge }
}

// Universal method (client + server)
const getSession = async ({ req, ctx } = {}) => {
  if (!req && ctx.req) {
    req = ctx.req
  }

  const baseUrl = _baseUrl()
  const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}
  const session = await _fetchData(`${baseUrl}/session`, fetchOptions)
  _sendMessage({ event: 'session', data: { trigger: 'getSession' } })
  return session
}

// Universal method (client + server)
const getCsrfToken = async ({ req }) => {
  const baseUrl = _baseUrl()
  const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}
  const data = await _fetchData(`${baseUrl}/csrf`, fetchOptions)
  return data && data.csrfToken ? data.csrfToken : null
}

// Universal method (client + server); does not require request headers
const getProviders = async () => {
  const baseUrl = _baseUrl()
  return _fetchData(`${baseUrl}/providers`)
}

// Context to store session data globally
const SessionContext = createContext()

// Client side method
// Hook to access the session data stored in the context
const useSession = (session) => {
  const value = useContext(SessionContext)
  // If we have no Provider in the tree we call the actual hook for fetching the session
  if (value === undefined) {
    return useSessionData(session)
  }

  return value
}

// Internal hook for getting session from the api.
const useSessionData = (session) => {
  const clientMaxAge = __NEXTAUTH.clientMaxAge * 1000
  const [data, setData] = useState(session)
  const [loading, setLoading] = useState(true)
  const _getSession = async (sendEvent = true) => {
    try {
      setData(await getSession())
      setLoading(false)

      // Send event to trigger other tabs to update (unless sendEvent is false)
      if (sendEvent) {
        _sendMessage({ event: 'session', data: { trigger: 'useSessionData' } })
      }

      if (typeof window !== 'undefined' && __NEXTAUTH.eventListenerAdded === false) {
        __NEXTAUTH.eventListenerAdded = true
        window.addEventListener('storage', async (event) => {
          if (event.key === 'nextauth.message') {
            const message = JSON.parse(event.newValue)
            if (message.event && message.event === 'session' && message.data) {
              // Fetch new session data but tell it not to fire an event to
              // avoid an infinite loop.
              //
              // Note: We could pass session data through and do something like
              // `setData(message.data)` but that causes problems depending on
              // how the session object is being used and may expose session
              // data to 3rd party scripts, it's safer to update the session
              // this way.
              await _getSession(false)
            }
          }
        })
      }

      // If CLIENT_MAXAGE is greater than zero, trigger auto re-fetching session
      if (clientMaxAge > 0) {
        setTimeout(async () => { await _getSession() }, clientMaxAge)
      }
    } catch (error) {
      logger.error('CLIENT_USE_SESSION_ERROR', error)
    }
  }
  useEffect(() => { _getSession() }, [])
  return [data, loading]
}

// Client side method
const signIn = async (provider, args) => {
  const baseUrl = _baseUrl()
  const callbackUrl = (args && args.callbackUrl) ? args.callbackUrl : window.location
  const providers = await getProviders()

  // Redirect to sign in page if no valid provider specified
  if (!provider || !providers[provider]) {
    // If Provider not recognized, redirect to sign in page
    window.location = `${baseUrl}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
  } else {
    // If is any other provider type, POST to provider URL with CSRF Token,
    // callback URL and any other parameters supplied.
    //
    // We pass 'json: true' to request a response in JSON instead of HTTP
    // as redirect URLs on other domains are not returned when accessed using
    // the fetch API in the browser, and we need to ask the end point to return
    // the response as a JSON object (the end point still defaults to returning
    // an HTTP response with a redirect for non-JavaScript clients).
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: _encodedForm({
        ...args,
        csrfToken: await getCsrfToken(),
        callbackUrl: callbackUrl,
        json: true
      })
    }
    const res = await fetch(`${baseUrl}/signin/${provider}`, options)
    const data = await res.json()
    window.location = data.url ? data.url : callbackUrl
  }
}

// Client side method
const signOut = async (args) => {
  const callbackUrl = (args && args.callbackUrl) ? args.callbackUrl : window.location

  const baseUrl = _baseUrl()
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: _encodedForm({
      csrfToken: await getCsrfToken(),
      callbackUrl: callbackUrl
    })
  }
  const res = await fetch(`${baseUrl}/signout`, options)

  _sendMessage({ event: 'session', data: { trigger: 'signout' } })

  window.location = res.url ? res.url : callbackUrl
}

// Provider to wrap the app in to make session data available globally
const Provider = ({ children, session, options }) => {
  setOptions(options)
  return createElement(SessionContext.Provider, { value: useSession(session) }, children)
}

const _fetchData = async (url, options = {}) => {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return Promise.resolve(Object.keys(data).length > 0 ? data : null) // Return null if data empty
  } catch (error) {
    logger.error('CLIENT_FETCH_ERROR', url, error)
    return Promise.resolve(null)
  }
}

const _baseUrl = () => {
  // NEXTAUTH_URL should always be set explicitly to support server side calls
  if (typeof window === 'undefined' && !process.env.NEXTAUTH_URL) {
    logger.warn('NEXTAUTH_URL', 'NEXTAUTH_URL environment variable not set')
  }

  let site = __NEXTAUTH.site

  // If site value exists but does not start with http or https protocol, add it here
  if (site.length > 0 && !site.startsWith('https://') && !site.startsWith('http://')) {
    site = `https://${site}`
  }

  // Remove trailing slash from site if there is one
  site = site.replace(/\/$/, '')

  return `${site}${__NEXTAUTH.basePath}`
}

const _encodedForm = (formData) => {
  return Object.keys(formData).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
  }).join('&')
}

const _sendMessage = (message) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('nextauth.message', JSON.stringify(message)) // eslint-disable-line
  }
}

export default {
  getSession,
  getCsrfToken,
  getProviders,
  useSession,
  Provider,
  signIn,
  signOut,
  /* Deprecated / unsupported features below this line */
  // Use setOptions() set options globally in the app.
  setOptions,
  // Some methods are exported with more than one name. This provides some
  // flexibility over how they can be invoked and backwards compatibility
  // with earlier releases.
  options: setOptions,
  session: getSession,
  providers: getProviders,
  csrfToken: getCsrfToken,
  signin: signIn,
  signout: signOut
}
