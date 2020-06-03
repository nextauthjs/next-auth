// Return a session object (without any private fields) for Single Page App clients
import jwt from 'jsonwebtoken'
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const { cookies, adapter, sessionMaxAge, jwt: useJwt, jwtSecret, debug } = options
  const { getUser, getSession, updateSession } = await adapter.getAdapter(options)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (!sessionToken) {
    res.setHeader('Content-Type', 'application/json')
    res.json({})
    return done()
  }

  let response = {}
  if (useJwt) {
    try {
      const token = jwt.verify(sessionToken, jwtSecret, { maxAge: sessionMaxAge })

      if (debug) {
        console.log('[NextAuth.js][DEBUG][JWT]', token)
      }

      // Update Session Expiry inside token (human readable, exposed to UI)
      const newExpiryDate = new Date()
      newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge)
      token.nextauth.sessionExpires = newExpiryDate.toISOString()

      // Update Session Expiry in JWT…
      token.exp = sessionMaxAge

      // Create new signed JWT (to replace existing one)
      const newToken = jwt.sign(token, jwtSecret)

      // Only expose a limited subset of information to the client as needed
      // for presentation purposes (e.g. "you are logged in as…").
      //
      // @TODO Should support `async seralizeUser({ user, function })` style
      // middleware function to allow response to be customized.
      response = {
        user: {
          name: token.nextauth.user.name,
          email: token.nextauth.user.email,
          image: token.nextauth.user.image
        },
        accessToken: token.nextauth.accessToken,
        expires: token.nextauth.sessionExpires
      }

      // Set cookie again to also update expiry on cookie
      cookie.set(res, cookies.sessionToken.name, newToken, { expires: token.nextauth.sessionExpires, ...cookies.sessionToken.options })
    } catch (error) {
      // If JWT not verifiable, make sure the cookie for it is removed and return empty object
      console.error('JWT_SESSION_ERROR', error)
      cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
    }
  } else {
    try {
      const session = await getSession(sessionToken)
      if (session) {
        // Trigger update to session object to update sessionExpires
        await updateSession(session)

        const user = await getUser(session.userId)

        // Only expose a limited subset of information to the client as needed
        // for presentation purposes (e.g. "you are logged in as…").
        //
        // @TODO Should support `async seralizeUser({ user, function })` style
        // middleware function to allow response to be customized.
        response = {
          user: {
            name: user.name,
            email: user.email,
            image: user.image
          },
          accessToken: session.accessToken,
          expires: session.sessionExpires
        }

        // Set cookie again to update expiry
        cookie.set(res, cookies.sessionToken.name, sessionToken, { expires: session.sessionExpires, ...cookies.sessionToken.options })
      } else if (sessionToken) {
        // If sessionToken was found set but it's not valid for a session then
        // remove the sessionToken cookie from browser.
        cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
      }
    } catch (error) {
      console.error('SESSION_ERROR', error)
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
