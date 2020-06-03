// Handle requests to /api/auth/signout
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const {
    adapter,
    cookies,
    callbackUrl,
    csrfTokenVerified,
    baseUrl,
    jwt: useJwt
  } = options

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

  // Don't need to update the database if is using JWT instead of session DB
  if (!useJwt) {
    // Use Session Token and get session from database
    const { deleteSession } = await adapter.getAdapter(options)
    const sessionToken = req.cookies[cookies.sessionToken.name]

    try {
      // Remove session from database
      await deleteSession(sessionToken)
    } catch (error) {
      // Log error and continue
      console.error('SIGNOUT_ERROR', error)
    }
  }

  // Remove Session Token
  cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })

  res.status(302).setHeader('Location', callbackUrl)
  res.end()
  return done()
}
