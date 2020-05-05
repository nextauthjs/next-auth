import { User } from "../../models/user"

// Returns a JSON object with current session object
export default async (req, res, options, resolve) => {
  const { sessionIdCookieName, adapter } = options
  const _adapter = await adapter.getAdapter()
  const { getUserById, getSessionById } = _adapter
  const sessionId = req.cookies[sessionIdCookieName]


  // @TODO provide adapter method to make it easy 
  // to safely seralize user information and avoid
  // making assumptions about the user / session model
  // (They should be loosely coupled.)
  const session = await getSessionById(sessionId)
  if (session) {
    const user = await getUserById(session.user)
    session.user = user

    // Avoid exposing Session ID or User ID
    // (but do expose the accessToken!)
    delete session.id
    delete session.user.id
  }

  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(session))
  return resolve()
}