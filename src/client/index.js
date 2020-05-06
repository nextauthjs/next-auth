import { useState, useEffect } from 'react'
import fetch from 'isomorphic-unfetch'

const URL_PREFIX_COOKIE = 'next-auth.url-prefix'
const DEFAULT_SITE = ''
const DEFAULT_PATH_PREFIX = '/api/auth'

// Isomorphic get session method
const session = ({req, site, pathPrefix}) => {
  return new Promise(async resolve => {  
    // If we have a 'req' object are running sever side and should get cookies from headers
    const cookies = req ? _parseCookie(req.headers.cookie) : null
    // We will need the raw header as it will have the HTTP only Session ID cookie in it
    // and we will need to pass that to get the session data back.
    const fetchOptions = req ? { headers: { cookie: req.headers.cookie } } : {}

    // If site and/or pathPrefix are specified, use them (or the defaults)
    // otherwise get the server URL from the HTTP only cookie.
    //
    // Note: If running client side (i.e. no 'req' object) will use relative
    // path by default (/api/auth) which is fine (only SSR needs absolute path).
    const urlPrefix = (site || pathPrefix || req === null)
      ? `${site || DEFAULT_SITE}${pathPrefix || DEFAULT_PATH_PREFIX}`
      : cookies[URL_PREFIX_COOKIE]
    
    try {
      const res = await fetch(`${urlPrefix}/session`, fetchOptions) // Absolute URL
      const data = await res.json()
      resolve(Object.keys(data).length > 0 ? data : null) // Return null if session data empty
    } catch (error) {
      console.error("CLIENT_SESSION_ERROR", error)
      resolve(null)
    }
  })
}

// Client Side Session method
const useSession = (session, pathPrefix) => {
  const [data, setData] = useState(session)
  const [loading, setLoading] = useState(true)
  const getSession = async () => {
    try {
      const res = await fetch(`${pathPrefix || DEFAULT_PATH_PREFIX}/session`) // Releative URL
      const data = await res.json()
      setData(Object.keys(data).length > 0 ? data : null) // Return null if session data empty
      setLoading(false)
    } catch (error) {
      console.error("CLIENT_SESSION_ERROR", error)
    }
  }
  useEffect(() => getSession(), [])
  return [data, loading]
}

// Adapted from https://github.com/felixfong227/simple-cookie-parser/blob/master/index.js
const _parseCookie = (string) => {
  if (!string)
    return {}
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
    console.error("CLIENT_COOKIE_PARSE_ERROR")
    return {}
  }
}

export default {
  session,
  useSession
}
