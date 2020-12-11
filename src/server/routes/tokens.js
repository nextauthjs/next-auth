
// NOTE: fetch() is built in to Next.js 9.4
/* global fetch:false */
import cookie from '../lib/cookie'
import logger from '../../lib/logger'

/**
 *
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @param {import('..').NextAuthOptions} options
 * @param {(value: any) => void} done
 */
export default async function tokens (req, res, options, done) {
  const { query } = req
  const {
    nextauth,
    tokenType = nextauth[2],
    action = nextauth[3]
  } = query
  const providerName = options?.provider

  const { cookies } = options
  const useJwtSession = options.session.jwt
  const hasAccessToken = cookies.sessionToken.name in req.cookies
  const sessionToken = req.cookies[cookies.sessionToken.name]

  let response = {}
  res.setHeader('Content-Type', 'application/json')

  if (!hasAccessToken && !sessionToken) {
    res.json(response)
    return done()
  }

  if (req.method === 'GET') {
    if (useJwtSession) {
      const provider = options.providers[providerName]
      if (provider?.type !== 'oauth') {
        res.json(response)
        logger.error('INVALID_TOKEN_PROVIDER', 'Invalid ')
        return done()
      }
      // TODO: decrypt with options.secret
      /** @type {import('../cookies').AccessToken} */
      let accessToken = req[cookies.accessToken.name]

      if (new Date().toISOString() < accessToken.accessTokenExpires) {
        // The access token is still fresh, return it
        response = {
          token: accessToken.accessToken,
          expires: accessToken.accessTokenExpires
        }
      } else {
        // If the provider is OIDC compliant, we can try to refresh the token
        if (provider.oidc) {
          try {
            accessToken = await refreshAccessToken({ accessToken, provider })
            response = accessToken
          } catch (error) {
            logger.error('REFRESH_TOKEN_ERROR', error)
          }
        } else {
          // REVIEW: redirect to signin(?)
        }
      }
    } else {
      const { adapter } = options
      try {
        const { getSession, updateSession, getAccounts, getAccount } = await adapter.getAdapter(options)
        const session = await getSession(sessionToken)
        if (session) {
          // Trigger update to session object to update session expiry
          await updateSession(session)

          if (!providerName) {
            response = await getAccounts(session.userId)
          } else {
            let expired
            // TODO: Determine if tokens have expired

            if (action === 'renew' || expired) {
              // TODO: Exchange refresh token for access token
            }

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

  res.json(response)
  return done()
}

/**
 * @param {{
 * token: import('../cookies').AccessToken,
 *   provider: {
 *   accessTokenUrl: string
 *   clientId: string
 *   clientSecret: string
 * }
 * }} params
 */
async function refreshAccessToken ({ token, provider }) {
  const response = await fetch(provider.accessTokenUrl, {
    body: new URLSearchParams({
      client_id: provider.clientId,
      client_secret: provider.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST'
  })

  const refreshedToken = await response.json()

  if (!response.ok) {
    throw new Error({ refreshToken: refreshedToken })
  }

  return {
    ...token,
    accessToken: refreshedToken.access_token,
    accessTokenExpires: new Date(refreshedToken.expires_in).toISOString(),
    // Fallback to the previous refresh_token, if it is not rotating/sliding
    refreshToken: refreshedToken.refresh_token || token.refreshToken
  }
}
