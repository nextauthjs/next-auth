// Return a session object (without any private fields) for Single Page App clients
import cookie from '../lib/cookie'
import logger from '../../lib/logger'

export default async (req, res, options, done) => {
  const { cookies, adapter, jwt } = options
  const useJwtSession = options.session.jwt
  const sessionMaxAge = options.session.maxAge
  const getSessionResponse = options.session.get
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
      const token = await jwt.decode({ secret: jwt.secret, token: sessionToken, maxAge: sessionMaxAge })

      // Allow token contents to be updated by JWT callback (if any specified)
      const newToken = await jwt.set(token)

      // Refresh JWT expiry by re-signing it, with an updated expiry date
      const newEncryptedToken = await jwt.encode({ secret: jwt.secret, token: newToken, maxAge: sessionMaxAge })

      // Set cookie expiry date
      const sessionExpiresDate = new Date()
      sessionExpiresDate.setTime(sessionExpiresDate.getTime() + (sessionMaxAge * 1000))
      const sessionExpires = sessionExpiresDate.toISOString()

      // Set cookie, to also update expiry date on cookie
      cookie.set(res, cookies.sessionToken.name, newEncryptedToken, { expires: sessionExpires, ...cookies.sessionToken.options })

      // Only expose a limited subset of information to the client as needed
      // for presentation purposes (e.g. "you are logged in as…").
      //
      // @TODO Should support `async seralizeUser({ user, function })` style
      // middleware function to allow response to be customized.
      response = await getSessionResponse({
        user: {
          name: token.user && token.user.name ? token.user.name : null,
          email: token.user && token.user.email ? token.user.email : null,
          image: token.user && token.user.image ? token.user.image : null
        },
        expires: sessionExpires
      }, newToken)
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

        // Only expose a limited subset of information to the client as needed
        // for presentation purposes (e.g. "you are logged in as…").
        //
        // @TODO Should support `async seralizeUser({ user, function })` style
        // middleware function to allow response to be customized.
        response = await getSessionResponse({
          user: {
            name: user.name,
            email: user.email,
            image: user.image
          },
          accessToken: session.accessToken,
          expires: session.expires
        })

        // Set cookie again to update expiry
        cookie.set(res, cookies.sessionToken.name, sessionToken, { expires: session.expires, ...cookies.sessionToken.options })
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
