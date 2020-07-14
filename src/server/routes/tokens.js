import cookie from '../lib/cookie'
import logger from '../../lib/logger'

export default async (req, res, options, done) => {
  const { query } = req
  const {
    nextauth,
    tokenType = nextauth[2]
  } = query
  const providerName = options ? options.provider : undefined

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
    if (req.method === 'GET') {
      try {
        const { getSession, updateSession, getAccounts, getAccount } = await adapter.getAdapter(options)
        const session = await getSession(sessionToken)
        if (session) {
          // Trigger update to session object to update session expiry
          await updateSession(session)
  
          if (!providerName) {
            response = await getAccounts(session.userId)
          } else {
            const account = await getAccount(session.userId, providerName)
            if (account) {
              switch (tokenType) {
                case undefined:
                case 'access':
                  response = {
                    type: 'access',
                    token: account.accessToken
                  }
                  break
                case 'refresh':
                  response = {
                    type: 'refresh',
                    token: account.refreshToken
                  }
                  break
                default:
                  res.status(404).end()
                  return done()
              }
            } else {
              res.status(404).end()
              return done()  
            }
          }
        } else if (sessionToken) {
          // If sessionToken was found set but it's not valid for a session then
          // remove the sessionToken cookie from browser.
          cookie.set(res, cookies.sessionToken.name, '', { ...cookies.sessionToken.options, maxAge: 0 })
        }
      } catch (error) {
        logger.error('TOKEN_ERROR', error)
      }
    }
  }

  res.setHeader('Content-Type', 'application/json')
  res.json(response)
  return done()
}
