// Return a session object (without any private fields) for Single Page App clients
import cookie from '../lib/cookie'

export default async (req, res, options, done) => {
  const { cookies, adapter } = options
  const { getUser, getSession, updateSession } = await adapter.getAdapter(options)
  const sessionToken = req.cookies[cookies.sessionToken.name]

  let response = {}

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

      // Update expiry on Session Token cookie
      cookie.set(res, cookies.sessionToken.name, sessionToken, { expires: session.sessionExpires, ...cookies.sessionToken.options })
    } else if (sessionToken) {
      // If sessionToken was found set but it's not valid for a session then
      // remove the sessionToken cookie from browser.
      cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
    }
  } catch (error) {
    console.error('SESSION_ERROR', error)
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
