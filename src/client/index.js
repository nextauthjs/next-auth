// fetch() is built in to Next.js 9.4 (you can use a polyfill if using an older version)
/* global fetch:false */
import { useState, useEffect, useContext, createContext, createElement } from 'react'
import logger from '../lib/logger'

// Note: In calls to fetch() from universal methods, all cookies are passed
// through from the browser, when the server makes the HTTP request, so that
// it can authenticate as the browser.

const NEXTAUTH_DEFAULT_SITE = ''
const NEXTAUTH_DEFAULT_BASE_PATH = '/api/auth'
const NEXTAUTH_DEFAULT_CLIENT_MAXAGE = 0 // e.g. 0 == disabled, 60 == 60 seconds

let NEXTAUTH_SITE = NEXTAUTH_DEFAULT_SITE
let NEXTAUTH_BASE_PATH = NEXTAUTH_DEFAULT_BASE_PATH
let NEXTAUTH_CLIENT_MAXAGE = NEXTAUTH_DEFAULT_CLIENT_MAXAGE
let NEXTAUTH_EVENT_LISTENER_ADDED = false

// You can 
const setConfig = ({
  site,
  basePath,
  clientMaxAge
} = {}) => {
  if (site) { NEXTAUTH_SITE = site }
  if (basePath) { NEXTAUTH_BASE_PATH = basePath }
  if (clientMaxAge) { NEXTAUTH_CLIENT_MAXAGE = clientMaxAge }
}

// Universal method (client + server)
const getSession = async ({req} = {}) => {
  const baseUrl = _baseUrl()
  const options = req ? { headers: { cookie: req.headers.cookie } } : {}
  const session = await _fetchData(`${baseUrl}/session`, options)
  _sendMessage({ event: 'session', data: { trigger: 'getSession' } })
  return session
}

// Universal method (client + server)
const getProviders = async () => {
  const baseUrl = _baseUrl()
  return _fetchData(`${baseUrl}/providers`)
}

// Universal method (client + server)
const getCsrfToken = async () => {
  const baseUrl = _baseUrl()
  const data = await _fetchData(`${baseUrl}/csrf`)
  return data && data.csrfToken ? data.csrfToken : null
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
  const clientMaxAge = NEXTAUTH_CLIENT_MAXAGE * 1000
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

      if (typeof window !== 'undefined' && NEXTAUTH_EVENT_LISTENER_ADDED === false) {
        NEXTAUTH_EVENT_LISTENER_ADDED = true
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
        setTimeout(async (session) => {
          await _getSession()
        }, clientMaxAge)
      }
    } catch (error) {
      logger.error('CLIENT_USE_SESSION_ERROR', error)
    }
  }
  useEffect(() => { _getSession() }, [])
  return [data, loading]
}

// Client side method
const signin = async (provider, args) => {
  const callbackUrl = (args && args.callbackUrl) ? args.callbackUrl : window.location

  if (!provider) {
    // Redirect to sign in page if no provider specified
    const baseUrl = _baseUrl()
    window.location = `${baseUrl}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    return
  }

  const providers = await getProviders()
  if (!providers[provider]) {
    // If Provider not recognized, redirect to sign in page
    const baseUrl = _baseUrl()
    window.location = `${baseUrl}/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
  } else if (providers[provider].type === 'oauth') {
    // If is an OAuth provider, redirect to providers[provider].signinUrl
    window.location = `${providers[provider].signinUrl}?callbackUrl=${encodeURIComponent(callbackUrl)}`
  } else {
    // If is any other provider type, POST to providers[provider].signinUrl (with CSRF Token)
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: _encodedForm({
        csrfToken: await getCsrfToken(),
        callbackUrl: callbackUrl,
        ...args
      })
    }
    const res = await fetch(providers[provider].signinUrl, options)
    window.location = res.url ? res.url : callbackUrl
  }
}

// Client side method
const signout = async (args) => {
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
const Provider = ({ children, session }) => {
  const value = useSession(session)
  return createElement(SessionContext.Provider, { value }, children)
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
  return `${NEXTAUTH_SITE}${NEXTAUTH_BASE_PATH}`
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
  // Call config() from _app.js to set options globally in the app.
  // You need to set at least the site name to use server side calls.
  config: setConfig,
  setConfig,
  // Some methods are exported with more than one name. This provides
  // flexibility over how they can be invoked and compatibility with earlier
  // releases (going back to v1 and earlier v2 beta releases).
  // e.g. NextAuth.session() or const { getSession } from 'next-auth/client'
  session: getSession,
  providers: getProviders,
  csrfToken: getCsrfToken,
  getSession,
  getProviders,
  getCsrfToken,
  useSession,
  Provider,
  signin,
  signout
}
