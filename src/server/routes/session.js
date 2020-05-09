// Return a session object (without any private fields) for Single Page App clients
export default async (req, res, options, done) => {
  const { cookies, adapter } = options
  const _adapter = await adapter.getAdapter()
  const { getUserById, getSessionById } = _adapter
  const sessionId = req.cookies[cookies.sessionId.name]

  let response = {}

  // @TODO Handle errors with try/catch
  const session = await getSessionById(sessionId)
  if (session) {
    const user = await getUserById(session.userId)
    // Only expose a limited subset of information to the client as needed
    // for presentation purposes (e.g. "you are logged in as…").
    //
    // @TODO Should support async seralizeUser({ user, function }) style
    // middleware function to allow response to be customized.
    response = {
      user: {
        name: user.name,
        email: user.email,
      },
      accessToken: session.accessToken
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}