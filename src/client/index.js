// fetch() is built in to Next.js 9.4 (you can use a polyfill if using an older version)
/* global fetch:false */
import { useState, useEffect, useContext, createContext, createElement } from 'react'

const URL_PREFIX_COOKIE = 'next-auth.url-prefix'
const DEFAULT_SITE = ''
const DEFAULT_PATH_PREFIX = '/api/auth'

// Isomorphic get session method
const session = async ({ req, site, pathPrefix, urlPrefixCookieName } = {}) => {
  // If we have a 'req' object are running sever side and should get cookies from headers
  const cookies = req ? _parseCookies(req.headers.cookie) : null
  // We will need the raw header as it will have the HTTP only Session ID cookie in it
  // and we will need to pass that to get the session data back.
  const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}

  // If site and/or pathPrefix are specified, use them (or the defaults)
  // otherwise get the server URL from the signed HTTP only cookie.
  //
  // If no options specified (which usually will be the case) then grab
  // the configuration dynamically from a cookie. Prefer the _Secure-
  // prefixed version if it is avalible, but fall back to checking the
  // version without the prefix so it still works on URLs like http://localhost
  //
  // If there is no cookie set, then we use the default prefix (/api/auth).
  const urlPrefix = (site || pathPrefix || !cookies)
    ? `${site || DEFAULT_SITE}${pathPrefix || DEFAULT_PATH_PREFIX}`
    : _getUrlPrefixFromCookies(cookies, urlPrefixCookieName)

  // If we are rendering server side but don't have a URL prefix, then give up
  // because we can't call fetch server side an absolute URL to query.
  if (req && !urlPrefix) { return null }

  try {
    const res = await fetch(`${urlPrefix}/session`, fetchOptions) // Absolute URL
    const data = await res.json()
    return Object.keys(data).length > 0 ? data : null // Return null if session data empty
  } catch (error) {
    console.error('CLIENT_SESSION_ERROR', error)
    return null
  }
}

// Context to store session data globally
const SessionContext = createContext()

// Internal hook for getting session from the api.
const useSessionData = (session, { pathPrefix }) => {
  const [data, setData] = useState(session)
  const [loading, setLoading] = useState(true)
  const getSession = async () => {
    try {
      const res = await fetch(`${pathPrefix || DEFAULT_PATH_PREFIX}/session`) // Releative URL
      const data = await res.json()
      setData(Object.keys(data).length > 0 ? data : null) // Return null if session data empty
      setLoading(false)
    } catch (error) {
      console.error('CLIENT_USE_SESSION_ERROR', error)
    }
  }
  useEffect(() => { getSession() }, [])
  return [data, loading]
}

// Provider to wrap the app in to make session data available globally
const Provider = ({ children, session, pathPrefix }) => {
  const value = useSession(session, { pathPrefix })

  return createElement(SessionContext.Provider, { value }, children)
}

// Hook to access the session data stored in the context
const useSession = (session, { pathPrefix }) => {
  const value = useContext(SessionContext)
  // If we have no Provider in the tree we call the actual hook for fetching the session
  if (value === undefined) {
    return useSessionData(session, { pathPrefix })
  }

  return value
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
  } catch (e) {
    console.error('CLIENT_COOKIE_PARSE_ERROR')
    return {}
  }
}

const _getUrlPrefixFromCookies = (cookies, urlPrefixCookieName) => {
  const cookieValue = cookies[urlPrefixCookieName] || cookies[`__Secure-${URL_PREFIX_COOKIE}`] || cookies[URL_PREFIX_COOKIE]
  const [urlPrefixValue] = cookieValue ? cookieValue.split('|') : [null]
  return urlPrefixValue
}

export default {
  session,
  useSession,
  Provider
}
