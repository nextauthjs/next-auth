/* global fetch:false */
import logger from '../lib/logger'
import parseUrl from '../lib/parse-url'

// This behaviour mirrors the default behaviour for getting the site name that
// happens server side in server/index.js
// 1. An empty value is legitimate when the code is being invoked client side as
//    relative URLs are valid in that context and so defaults to empty.
// 2. When invoked server side the value is picked up from an environment
//    variable and defaults to 'http://localhost:3000'.
export const __NEXTAUTH = {
  baseUrl: parseUrl(process.env.NEXTAUTH_URL || process.env.VERCEL_URL).baseUrl,
  basePath: parseUrl(process.env.NEXTAUTH_URL).basePath,
  keepAlive: 0, // 0 == disabled (don't send); 60 == send every 60 seconds
  clientMaxAge: 0, // 0 == disabled (only use cache); 60 == sync if last checked > 60 seconds ago
  // Properties starting with _ are used for tracking internal app state
  _clientLastSync: 0, // used for timestamp since last sycned (in seconds)
  _clientSyncTimer: null, // stores timer for poll interval
  _eventListenersAdded: false, // tracks if event listeners have been added,
  _clientSession: undefined, // stores last session response from hook,
  // Generate a unique ID to make it possible to identify when a message
  // was sent from this tab/window so it can be ignored to avoid event loops.
  _clientId: Math.random().toString(36).substring(2) + Date.now().toString(36),
  // Used to store to function export by getSession() hook
  _getSession: () => {}
}

// Add event listners on load
if (typeof window !== 'undefined') {
  if (__NEXTAUTH._eventListenersAdded === false) {
    __NEXTAUTH._eventListenersAdded = true

    // Listen for storage events and update session if event fired from
    // another window (but suppress firing another event to avoid a loop)
    window.addEventListener('storage', async (event) => {
      if (event.key === 'nextauth.message') {
        const message = JSON.parse(event.newValue)
        if (message.event && message.event === 'session' && message.data) {
          // Ignore storage events fired from the same window that created them
          if (__NEXTAUTH._clientId === message.clientId) {
            return
          }

          // Fetch new session data but pass 'true' to it not to fire an event to
          // avoid an infinite loop.
          //
          // Note: We could pass session data through and do something like
          // `setData(message.data)` but that can cause problems depending
          // on how the session object is being used in the client; it is
          // more robust to have each window/tab fetch it's own copy of the
          // session object rather than share it across instances.
          await __NEXTAUTH._getSession({ event: 'storage' })
        }
      }
    })

    // Listen for window focus/blur events
    window.addEventListener('focus', async (event) => __NEXTAUTH._getSession({ event: 'focus' }))
    window.addEventListener('blur', async (event) => __NEXTAUTH._getSession({ event: 'blur' }))
  }
}

// Method to set options. The documented way is to use the provider, but this
// method is being left in as an alternative, that will be helpful if/when we
// expose a vanilla JavaScript version that doesn't depend on React.
export function setOptions ({
  baseUrl,
  basePath,
  clientMaxAge,
  keepAlive
} = {}) {
  if (baseUrl) { __NEXTAUTH.baseUrl = baseUrl }
  if (basePath) { __NEXTAUTH.basePath = basePath }
  if (clientMaxAge) { __NEXTAUTH.clientMaxAge = clientMaxAge }
  if (keepAlive) {
    __NEXTAUTH.keepAlive = keepAlive

    if (typeof window !== 'undefined' && keepAlive > 0) {
      // Clear existing timer (if there is one)
      if (__NEXTAUTH._clientSyncTimer !== null) { clearTimeout(__NEXTAUTH._clientSyncTimer) }

      // Set next timer to trigger in number of seconds
      __NEXTAUTH._clientSyncTimer = setTimeout(async () => {
        // Only invoke keepalive when a session exists
        if (__NEXTAUTH._clientSession) {
          await __NEXTAUTH._getSession({ event: 'timer' })
        }
      }, keepAlive * 1000)
    }
  }
}

/** Wrapper for `fetch` */
export async function _fetchData (url, options = {}) {
  try {
    const res = await fetch(url, options)
    const data = await res.json()
    return Object.keys(data).length > 0 ? data : null // Return null if data empty
  } catch (error) {
    logger.error('CLIENT_FETCH_ERROR', url, error)
    return null
  }
}

/**
 * Get the correct api base url either on client or server-side
 * Return absolute path when called server side.
 * Return relative path when called client side.
 */
export function _apiBaseUrl () {
  if (typeof window === 'undefined') {
    // NEXTAUTH_URL should always be set explicitly to support server side calls - log warning if not set
    if (!process.env.NEXTAUTH_URL) { logger.warn('NEXTAUTH_URL', 'NEXTAUTH_URL environment variable not set') }

    // Return absolute path when called server side
    return `${__NEXTAUTH.baseUrl}${__NEXTAUTH.basePath}`
  } else {
    // Return relative path when called client side
    return __NEXTAUTH.basePath
  }
}

// TODO: use URLSearchParams when IE11 is not a concern anymore.
export function _encodedForm (formData) {
  return Object.keys(formData).map((key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
  }).join('&')
}

export function _sendMessage (message) {
  if (typeof localStorage !== 'undefined') {
    const timestamp = Math.floor(new Date().getTime() / 1000)
    localStorage.setItem( // eslint-disable-line
      'nextauth.message',
      JSON.stringify({ ...message, clientId: __NEXTAUTH._clientId, timestamp })
    )
  }
}
