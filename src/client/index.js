// fetch() is built in to Next.js 9.4 (you can use a polyfill if using an older version)
/* global fetch:false */
import { useState, useEffect, useContext, createContext, createElement } from 'react'
import logger from '../lib/logger'

// Note: In calls to fetch() from universal methods, all cookies are passed
// through from the browser, when the server makes the HTTP request, so that
// it can authenticate as the browser.

// These can be overridden with NEXTAUTH_ env vars in next.config.js
// e.g. process.env.NEXTAUTH_SITE
const NEXTAUTH_DEFAULT_BASE_URL_COOKIE_NAME = 'next-auth.base-url'
const NEXTAUTH_DEFAULT_SITE = ''
const NEXTAUTH_DEFAULT_BASE_PATH = '/api/auth'
const NEXTAUTH_DEFAULT_CLIENT_MAXAGE = 0 // e.g. 0 == disabled, 60 == 60 seconds

let NEXTAUTH_EVENT_LISTENER_ADDED = false

// Universal method (client + server)
const getSession = async ({ req } = {}) => {
  const baseUrl = _baseUrl({ req })
  const options = req ? { headers: { cookie: req.headers.cookie } } : {}
  const session = await _fetchData(`${baseUrl}/session`, options)
  _sendMessage({
    event: 'session',
    data: session
  })
  return session
}

// Universal method (client + server)
const getProviders = async ({ req } = {}) => {
  const baseUrl = _baseUrl({ req })
  const options = req ? { headers: { cookie: req.headers.cookie } } : {}
  return _fetchData(`${baseUrl}/providers`, options)
}

// Universal method (client + server)
const getCsrfToken = async ({ req } = {}) => {
  const baseUrl = _baseUrl({ req })
  const options = req ? { headers: { cookie: req.headers.cookie } } : {}
  const data = await _fetchData(`${baseUrl}/csrf`, options)
  return data.csrfToken
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
  const clientMaxAge = (process.env.NEXTAUTH_CLIENT_MAXAGE || NEXTAUTH_DEFAULT_CLIENT_MAXAGE) * 1000

  const [data, setData] = useState(session)
  const [loading, setLoading] = useState(true)
  const _getSession = async (sendEvent = true) => {
    try {
      setData(await getSession())
      setLoading(false)

      // Send event to trigger other tabs to update (unless sendEvent is false)
      if (sendEvent) {
        _sendMessage({ event: 'session', data: session })
      }

      if (typeof window !== 'undefined' && NEXTAUTH_EVENT_LISTENER_ADDED === false) {
        NEXTAUTH_EVENT_LISTENER_ADDED = true
        window.addEventListener('storage', async (event) => {
          if (event.key == 'nextauth.message') {
            const message = JSON.parse(event.newValue)
            if (message.event && message.event === 'session' && message.data) {
              // Fetch new session data but tell it not to fire an event to
              // avoid an infinate loop.
              //
              // Note: We could do `setData(message.data)` but that causes
              // problems depending on how the session object is being used
              // on a page, it's safer to update the session this way.
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

  _sendMessage({
    event: 'session',
    data: {}
  })

  window.location = res.url ? res.url : callbackUrl
}

// Provider to wrap the app in to make session data available globally
const Provider = ({ children, session }) => {
  const value = useSession(session)
  return createElement(SessionContext.Provider, { value }, children)
}

const _fetchData = async (url, options) => {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return Promise.resolve(Object.keys(data).length > 0 ? data : null) // Return null if data empty
  } catch (error) {
    logger.error('CLIENT_FETCH_ERROR', url, error)
    return Promise.resolve(null)
  }
}

const _baseUrl = ({ req } = {}) => {
  if (req) {
    // Server Side
    // If we have a 'req' object are running sever side, so we should grab the
    // base URL from cookie that is set by the API route - which is how config
    // is shared automatically between the API route and the client.
    const cookies = req ? _parseCookies(req.headers.cookie) : null
    const baseUrlCookieName = process.env.NEXTAUTH_BASE_URL_COOKIE_NAME || NEXTAUTH_DEFAULT_BASE_URL_COOKIE_NAME
    const cookieValue = cookies[`__Secure-${baseUrlCookieName}`] || cookies[baseUrlCookieName]
    const [baseUrl] = cookieValue ? cookieValue.split('|') : [null]
    return baseUrl
  } else {
    // Client Side
    // Note: 'site' is empty by default; URL is normally relative.
    const site = process.env.NEXTAUTH_SITE || NEXTAUTH_DEFAULT_SITE
    const basePath = process.env.NEXTAUTH_BASE_PATH || NEXTAUTH_DEFAULT_BASE_PATH
    return `${site}${basePath}`
  }
}

// Adapted from https://github.com/felixfong227/simple-cookie-parser/blob/master/index.js
const _parseCookies = (string) => {
  if (!string) { return {} }
  try {
    const object = {}
    const a = string.split(';')
    for (let i = 0; i < a.length; i++) {
      const b = a[i].split('=')
      if (b[0].length > 1 && b[1]) {
        object[b[0].trim()] = decodeURIComponent(b[1])
      }
    }
    return object
  } catch (error) {
    logger.error('CLIENT_COOKIE_PARSE_ERROR', error)
    return {}
  }
}

const _encodedForm = (formData) => {
  return Object.keys(formData).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
  }).join('&')
}

// use local storage for messaging. Set message in local storage and clear it right away
// This is a safe way how to communicate with other tabs while not leaving any traces
//
const _sendMessage = (message) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('nextauth.message', JSON.stringify(message))
  }
}

export default {
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
