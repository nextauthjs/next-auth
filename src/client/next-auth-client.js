'use strict'

import fetch from 'isomorphic-fetch'

export default class {
  /**
   * This is an async, isometric method which returns a session object - 
   * either by looking up the current express session object when run on the
   * server, or by using fetch (and optionally caching the result in local
   * storage) when run on the client.  
   * 
   * Note that actual session tokens are not stored in local storage, they are
   * kept in an HTTP Only cookie as protection against session hi-jacking by
   * malicious JavaScript.
   **/
  static async init({
    req = null,
    force = false
  } = {}) {
    let session = {}
    if (req) {
      if (req.session) {
        // If running on the server session data should be in the req object
        session.csrfToken = req.connection._httpMessage.locals._csrf
        session.expires = req.session.cookie._expires
        // If the user is logged in, add the user to the session object
        if (req.user) {
          session.user = req.user
        }
      }
    } else {
      // If running in the browser attempt to load session from sessionStore
      if (force === true) {
        // If force update is set, reset data store
        this._removeLocalStore('session')
      } else {
        session = this._getLocalStore('session')
      }
    }

    // If session data exists, has not expired AND force is not set then
    // return the stored session we already have.
    if (session && Object.keys(session).length > 0 && session.expires && session.expires > Date.now()) {
      return new Promise(resolve => {
        resolve(session)
      })
    } else {
      // If running on server, but session has expired return empty object
      // (no valid session)
      if (typeof window === 'undefined') {
        return new Promise(resolve => {
          resolve({})
        })
      }
    }

    // If we don't have session data, or it's expired, or force is set
    // to true then revalidate it by fetching it again from the server.
    return fetch('/auth/session', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response
      } else {
        return Promise.reject(Error('HTTP error when trying to get session'))
      }
    })
    .then(response => response.json())
    .then(data => {
      // Update session with session info
      session = data

      // Set a value we will use to check this client should silently
      // revalidate, using the value for revalidateAge returned by the server.
      session.expires = Date.now() + session.revalidateAge

      // Save changes to session
      this._saveLocalStore('session', session)

      return session
    })
    .catch(() => Error('Unable to get session'))
  }

  /**
   * A simple static method to get the CSRF Token is provided for convenience
   **/
  static async csrfToken() {
    return fetch('/auth/csrf', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response
      } else {
        return Promise.reject(Error('Unexpected response when trying to get CSRF token'))
      }
    })
    .then(response => response.json())
    .then(data => data.csrfToken)
    .catch(() => Error('Unable to get CSRF token'))
  }

  /**
   * A static method to get list of currently linked oAuth accounts
   **/
  static async linked({
    req = null
  } = {}) {
    // If running server side, uses server side method
    if (req) return req.linked()
    
    // If running client side, use RESTful endpoint
    return fetch('/auth/linked', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response
      } else {
        return Promise.reject(Error('Unexpected response when trying to get linked accounts'))
      }
    })
    .then(response => response.json())
    .then(data => data)
    .catch(() => Error('Unable to get linked accounts'))
  }
  
  /**
   * A static method to get list of currently configured oAuth providers
   **/
  static async providers({
    req = null
  } = {}) {
    // If running server side, uses server side method
    if (req) return req.providers()
    
    // If running client side, use RESTful endpoint
    return fetch('/auth/providers', {
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response
      } else {
        return Promise.reject(Error('Unexpected response when trying to get oAuth providers'))
      }
    })
    .then(response => response.json())
    .then(data => data)
    .catch(() => Error('Unable to get oAuth providers'))
  }
  
  static async signin(email) {
    // Sign in to the server

    // Load current session info from cache
    let session = await this.init()

    // Make sure we have the latest CSRF Token in our session
    session.csrfToken = await this.csrfToken()

    const formData = {
      _csrf: session.csrfToken,
      email,
    }
    
    // Encoded form parser for sending data in the body
    const encodedForm = Object.keys(formData).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    }).join('&')

    return fetch('/auth/email/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm,
      credentials: 'same-origin'
    })
    .then(response => {
      if (response.ok) {
        return response
      } else {
        return Promise.reject(Error('HTTP error while attempting to sign in'))
      }
    })
    .then(() => true)
    .catch(() => Error('Unable to sign in'))
  }

  static async signout() {
    // Signout from the server
    const csrfToken = await this.csrfToken()
    const formData = { _csrf: csrfToken }

    // Encoded form parser for sending data in the body
    const encodedForm = Object.keys(formData).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(formData[key])
    }).join('&')
    
    // Remove cached session data
    this._removeLocalStore('session')

    return fetch('/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedForm,
      credentials: 'same-origin'
    })
    .then(() => {
      return true
    })
    .catch(() => Error('Unable to sign out'))
  }

  // The Web Storage API is widely supported, but not always available (e.g.
  // it can be restricted in private browsing mode, triggering an exception).
  // We handle that silently by just returning null here.
  static _getLocalStore(name) {
    try {
      return JSON.parse(localStorage.getItem(name))
    } catch (err) {
      return null
    }
  }
  
  static _saveLocalStore(name, data) {
    try {
      localStorage.setItem(name, JSON.stringify(data))
      return true
    } catch (err) {
      return false
    }
  }
  
  static _removeLocalStore(name) {
    try {
      localStorage.removeItem(name)
      return true
    } catch (err) {
      return false
    }
  }
}