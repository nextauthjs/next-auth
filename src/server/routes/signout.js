// Handle requests to /api/auth/signout
import cookie from '../lib/cookie'
import logger from '../../lib/logger'
import dispatchEvent from '../lib/dispatch-event'

export default async (req, res, options, done) => {
  const { adapter, cookies, events, jwt, callbackUrl, csrfTokenVerified, baseUrl } = options
  const sessionMaxAge = options.session.maxAge
  const useJwtSession = options.session.jwt
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (!csrfTokenVerified) {
    // If a csrfToken was not verified with this request, send the user to
    // the signout page, as they should have a valid one now and clicking
    // the signout button should work.
    //
    // Note: Adds ?csrf=true query string param to URL for debugging/tracking.
    // @TODO Add support for custom signin URLs
    res.status(302).setHeader('Location', `${baseUrl}/signout?csrf=true`)
    res.end()
    return done()
  }

  if (useJwtSession) {
    // Dispatch signout event
    try {
      const decodedJwt = await jwt.decode({ secret: jwt.secret, token: sessionToken, maxAge: sessionMaxAge })
      await dispatchEvent(events.signout, decodedJwt)
    } catch (error) {
      // Do nothing if decoding the JWT fails
    }
  } else {
    // Get session from database
    const { getSession, deleteSession } = await adapter.getAdapter(options)

    try {
      // Dispatch signout event
      const session = await getSession(sessionToken)
      await dispatchEvent(events.signout, session)
    } catch (error) {
      // Do nothing if looking up the session fails
    }

    try {
      // Remove session from database
      await deleteSession(sessionToken)
    } catch (error) {
      // If error, log it but continue
      logger.error('SIGNOUT_ERROR', error)
    }
  }

  // Remove Session Token 
  cookie.set(res, cookies.sessionToken.name, '', {
    ...cookies.sessionToken.options,
    maxAge: 0
  })

  res.status(302).setHeader('Location', callbackUrl)
  res.end()
  return done()
}
