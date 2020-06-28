// fetch() is built in to Next.js 9.4 (you can use a polyfill if using an older version)
/* global fetch:false */
import { useState, useEffect, useContext, createContext, createElement } from 'react'
import logger from '../lib/logger'

const __NEXTAUTH = {
  site: '',
  basePath: '/api/auth',
  clientMaxAge: 0 // e.g. 0 == disabled, 60 == 60 seconds
}

let __NEXTAUTH_EVENT_LISTENER_ADDED = false

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

      if (typeof window !== 'undefined' && __NEXTAUTH_EVENT_LISTENER_ADDED === false) {
        __NEXTAUTH_EVENT_LISTENER_ADDED = true
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

const _baseUrl = () => `${__NEXTAUTH.site}${__NEXTAUTH.basePath}`

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
  options: setOptions,
  setOptions,
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
