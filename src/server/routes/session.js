// Return a session object (without any private fields) for Single Page App clients
import cookie from '../lib/cookie'
import logger from '../../lib/logger'
import dispatchEvent from '../lib/dispatch-event'

export default async (req, res, options, done) => {
  const { cookies, adapter, jwt, events, callbacks } = options
  const useJwtSession = options.session.jwt
  const sessionMaxAge = options.session.maxAge
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (!sessionToken) {
    res.setHeader('Content-Type', 'application/json')
    res.json({})
    return done()
  }

  let response = {}
  if (useJwtSession) {
    try {
      // Decrypt and verify token
      const decodedJwt = await jwt.decode({ secret: jwt.secret, key: jwt.key, token: sessionToken, maxAge: sessionMaxAge, encryption: jwt.encryption })

      // Generate new session expiry date
      const sessionExpiresDate = new Date()
      sessionExpiresDate.setTime(sessionExpiresDate.getTime() + (sessionMaxAge * 1000))
      const sessionExpires = sessionExpiresDate.toISOString()

      // By default, only exposes a limited subset of information to the client
      // as needed for presentation purposes (e.g. "you are logged in as…").
      const defaultSessionPayload = {
        user: {
          name: decodedJwt.user && decodedJwt.user.name ? decodedJwt.user.name : null,
          email: decodedJwt.user && decodedJwt.user.email ? decodedJwt.user.email : null,
          image: decodedJwt.user && decodedJwt.user.image ? decodedJwt.user.image : null
        },
        expires: sessionExpires
      }

      // Pass Session and JSON Web Token through to the session callback
      const jwtPayload = await callbacks.jwt(decodedJwt)
      const sessionPayload = await callbacks.session(defaultSessionPayload, jwtPayload)

      // Return session payload as response
      response = sessionPayload

      // Refresh JWT expiry by re-signing it, with an updated expiry date
      const newEncodedJwt = await jwt.encode({ secret: jwt.secret, key: jwt.key, token: jwtPayload, maxAge: sessionMaxAge, encryption: jwt.encryption })

      // Set cookie, to also update expiry date on cookie
      cookie.set(res, cookies.sessionToken.name, newEncodedJwt, { expires: sessionExpires, ...cookies.sessionToken.options })

      await dispatchEvent(events.session, { session: sessionPayload, jwt: jwtPayload })
    } catch (error) {
      // If JWT not verifiable, make sure the cookie for it is removed and return empty object
      logger.error('JWT_SESSION_ERROR', error)
      cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
    }
  } else {
    try {
      const { getUser, getSession, updateSession } = await adapter.getAdapter(options)
      const session = await getSession(sessionToken)
      if (session) {
        // Trigger update to session object to update session expiry
        await updateSession(session)

        const user = await getUser(session.userId)

        // By default, only exposes a limited subset of information to the client
        // as needed for presentation purposes (e.g. "you are logged in as…").
        const defaultSessionPayload = {
          user: {
            name: user.name,
            email: user.email,
            image: user.image
          },
          accessToken: session.accessToken,
          expires: session.expires
        }

        // Pass Session through to the session callback
        const sessionPayload = await callbacks.session(defaultSessionPayload)

        // Return session payload as response
        response = sessionPayload

        // Set cookie again to update expiry
        cookie.set(res, cookies.sessionToken.name, sessionToken, { expires: session.expires, ...cookies.sessionToken.options })

        await dispatchEvent(events.session, { session: sessionPayload })
      } else if (sessionToken) {
        // If sessionToken was found set but it's not valid for a session then
        // remove the sessionToken cookie from browser.
        cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
      }
    } catch (error) {
      logger.error('SESSION_ERROR', error)
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
