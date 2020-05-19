// Handle requests to /api/auth/signout
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const { adapter, cookies, callbackUrl, csrfTokenVerified, urlPrefix } = options
  const { deleteSession } = await adapter.getAdapter(options)

  // Get session ID (if set)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (csrfTokenVerified) {
    try {
      // Delete session sessionToken
      cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })

      // Remove session from database
      await deleteSession(sessionToken)
    } catch (error) {
      // Log error and continue
      console.error('SIGNOUT_ERROR', error)
    }

    res.status(302).setHeader('Location', callbackUrl)
    res.end()
    return done()
  } else {
    // If a csrfToken was not verified with this request, send the user to
    // the signout page, as they should have a valid one now and clicking
    // the signout button should work.
    //
    // Note: Adds ?csrf=true query string param to URL for debugging/tracking.
    // @TODO Add support for custom signin URLs
    res.status(302).setHeader('Location', `${urlPrefix}/signout?csrf=true`)
    res.end()
    return done()
  }
}
