// Handle requests to /api/auth/signout
export default async (req, res, options, done) => {
  const { adapter, cookies, callbackUrl, csrfTokenVerified } = options
  const _adapter = await adapter.getAdapter()
  const { deleteSessionById } = _adapter
  
  // Get session ID (if set)
  const sessionId = req.cookies[cookies.sessionId.name]

  if (csrfTokenVerified) {
    try {
      // @TODO Delete session cookie
      await deleteSessionById(sessionId)
    } catch (error) {
      // Log error and continue
      console.error('SIGNOUT_ERROR', error)
    }

    res.setHeader('Location', callbackUrl)
    res.status(302).end()
    return done()
  } else {
    // If a csrfToken was not verified with this request, send the user to 
    // the signout page, as they should have a valid one now and clicking
    // the signout button should work.
    //
    // Note: Adds ?csrf=true query string param to URL for debugging/tracking.
    res.status(302).setHeader('Location', `${urlPrefix}/signout?csrf=true`)
    return done()
  }
}