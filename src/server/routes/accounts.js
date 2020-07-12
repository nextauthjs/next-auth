import cookie from '../lib/cookie'
import logger from '../../lib/logger'

export default async (req, res, options, done) => {
  const { cookies, adapter } = options
  const useJwtSession = options.session.jwt
  const sessionToken = req.cookies[cookies.sessionToken.name]

  if (!sessionToken) {
    res.setHeader('Content-Type', 'application/json')
    res.json({})
    return done()
  }

  let response = {}
  if (!useJwtSession) {
    try {
      const { getSession, updateSession, getAccounts } = await adapter.getAdapter(options)
      const session = await getSession(sessionToken)
      if (session) {
        // Trigger update to session object to update session expiry
        await updateSession(session)

        const accounts = await getAccounts(session.userId)
        response = accounts;
      } else if (sessionToken) {
        // If sessionToken was found set but it's not valid for a session then
        // remove the sessionToken cookie from browser.
        cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
      }
    } catch (error) {
      logger.error('ACCOUNTS_ERROR', error)
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
