// create faunadb server key
// create collections: users, accounts, sessions, verificationRequests
// create required indexes

import faunadb, { query as q } from 'faunadb'
import { v4 as uuidv4 } from 'uuid'
import { createHash, randomBytes } from 'crypto'

const INDEX_USERS_ID = 'index_users_id'
const INDEX_USERS_EMAIL = 'index_users_email'
const INDEX_USERS_ACCOUNT_ID_PROVIDER_ID = 'index_accounts_providerId_providerAccountId'
const INDEX_VERIFICATION_REQUESTS_TOKEN = 'index_verificationRequests_token'
const INDEX_SESSIONS_ID = 'index_sessions_id'
const INDEX_SESSIONS_SESSION_TOKEN = 'index_sessions_sessionToken'

const serverClient = new faunadb.Client({ secret: process.env.FAUNADB_SERVER_KEY })

function faunaWrapper (faunaQ, errorTag) {
  try {
    return serverClient.query(faunaQ)
  } catch (error) {
    console.error(errorTag, error)
    return Promise.reject(new Error(errorTag, error))
  }
}

const Adapter = (config, options = {}) => {
  async function getAdapter (appOptions) {
    if (appOptions && (!appOptions.session || !appOptions.session.maxAge)) {
      console.log('no default options for session')
    }

    const defaultSessionMaxAge = 30 * 24 * 60 * 60 * 1000
    const sessionMaxAge =
            appOptions && appOptions.session && appOptions.session.maxAge
              ? appOptions.session.maxAge * 1000
              : defaultSessionMaxAge
    const sessionUpdateAge =
            appOptions && appOptions.session && appOptions.session.updateAge
              ? appOptions.session.updateAge * 1000
              : 24 * 60 * 60 * 1000

    async function createUser (profile) {
      console.log('-----------createUser------------')
      // console.log(profile);
      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('users'), {
            data: {
              ...profile,
              emailVerified: profile.emailVerified
                ? profile.emailVerified.toISOString()
                : null,
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          })
        ),
        'CREATE_USER_ERROR'
      )
    }

    async function getUser (id) {
      console.log('-----------getUser------------')
      // console.log(id);
      return faunaWrapper(
        q.Select('data', q.Get(q.Match(q.Index(INDEX_USERS_ID), id))),
        'GET_USER_BY_ID_ERROR'
      )
    }

    async function getUserByEmail (email) {
      console.log('-----------getUserByEmail------------')
      // console.log(email);
      return faunaWrapper(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_USERS_EMAIL), email)
          },
          q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null)
        ),
        'GET_USER_BY_EMAIL_ERROR'
      )
    }

    async function getUserByProviderAccountId (providerId, providerAccountId) {
      console.log('-----------getUserByProviderAccountId------------')
      // console.log(providerId, providerAccountId);

      return faunaWrapper(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_USERS_ACCOUNT_ID_PROVIDER_ID), [
              providerId,
              providerAccountId
            ])
          },
          q.If(
            q.Exists(q.Var('ref')),
            q.Select(
              'data',
              q.Get(
                q.Match(
                  q.Index(INDEX_USERS_ID),
                  q.Select('userId', q.Select('data', q.Get(q.Var('ref'))))
                )
              )
            ),
            null
          )
        ),
        'GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR'
      )
    }

    async function updateUser (user) {
      console.log('-----------updateUser------------')
      // console.log(user);
      return faunaWrapper(
        q.Select(
          'data',
          q.Update(q.Select('ref', q.Get(q.Match(q.Index(INDEX_USERS_ID), user.id))), {
            data: {
              ...user,
              updatedAt: Date.now(),
              emailVerified: user.emailVerified
                ? user.emailVerified.toISOString()
                : null
            }
          })
        ),
        'UPDATE_USER_ERROR'
      )
    }

    async function linkAccount (
      userId,
      providerId,
      providerType,
      providerAccountId,
      refreshToken,
      accessToken,
      accessTokenExpires
    ) {
      console.log('-----------linkAccount------------')
      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('accounts'), {
            data: {
              userId,
              providerId,
              providerType,
              providerAccountId,
              refreshToken,
              accessToken,
              accessTokenExpires,
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          })
        ),
        'LINK_ACCOUNT_ERROR'
      )
    }

    async function createSession (user) {
      console.log('-----------createSession------------')
      // console.log(user);
      let expires = null
      if (sessionMaxAge) {
        const dateExpires = new Date()
        dateExpires.setTime(dateExpires.getTime() + sessionMaxAge)
        expires = dateExpires.toISOString()
      }

      return faunaWrapper(
        q.Select(
          'data',
          q.Create(q.Collection('sessions'), {
            data: {
              expires,
              userId: user.id,
              sessionToken: randomBytes(32).toString('hex'),
              accessToken: randomBytes(32).toString('hex'),
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          })
        ),
        'CREATE_SESSION_ERROR'
      )
    }

    async function getSession (sessionToken) {
      console.log('-----------getSession------------')
      // console.log(sessionToken);

      const session = await serverClient.query(
        q.Let(
          {
            ref: q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken)
          },
          q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null)
        )
      )
      // Check session has not expired (do not return it if it has)
      if (session && session.expires && new Date() > session.expires) {
        await serverClient.query(
          q.Delete(
            q.Select(
              'ref',
              q.Get(q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken))
            )
          )
        )
        return null
      }

      return session
    }

    async function updateSession (session, force) {
      console.log('-----------updateSession------------')
      // console.log(session, force);
      if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.expires) {
        // Calculate last updated date, to throttle write updates to database
        // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
        //     e.g. ({expiry date} - 30 days) + 1 hour
        //
        // Default for sessionMaxAge is 30 days.
        // Default for sessionUpdateAge is 1 hour.
        const dateSessionIsDueToBeUpdated = new Date(session.expires)
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge
        )
        dateSessionIsDueToBeUpdated.setTime(
          dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge
        )

        // Trigger update of session expiry date and write to database, only
        // if the session was last updated more than {sessionUpdateAge} ago
        if (new Date() > dateSessionIsDueToBeUpdated) {
          const newExpiryDate = new Date()
          newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge)
          session.expires = newExpiryDate
        } else if (!force) {
          return null
        }
      } else {
        // If session MaxAge, session UpdateAge or session.expires are
        // missing then don't even try to save changes, unless force is set.
        if (!force) {
          return null
        }
      }

      const { id, expires } = session
      return faunaWrapper(
        q.Update(q.Select('ref', q.Get(q.Match(q.Index(INDEX_SESSIONS_ID), id))), {
          data: {
            expires,
            updatedAt: Date.now()
          }
        }),
        'UPDATE_SESSION_ERROR'
      )
    }

    async function deleteSession (sessionToken) {
      console.log('-----------deleteSession------------')
      // console.log(sessionToken);

      return faunaWrapper(
        q.Delete(
          q.Select(
            'ref',
            q.Get(q.Match(q.Index(INDEX_SESSIONS_SESSION_TOKEN), sessionToken))
          )
        ),
        'DELETE_SESSION_ERROR'
      )
    }

    async function createVerificationRequest (identifier, url, token, secret, provider) {
      console.log('-----------createVerificationRequest------------')
      // console.log((identifier, url, token, secret, provider));
      try {
        const { baseUrl } = appOptions
        const { sendVerificationRequest, maxAge } = provider

        // Store hashed token (using secret as salt) so that tokens cannot be exploited
        // even if the contents of the database is compromised.
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')

        let expires = null
        if (maxAge) {
          const dateExpires = new Date()
          dateExpires.setTime(dateExpires.getTime() + maxAge * 1000)
          expires = dateExpires.toISOString()
        }

        // Save to database
        const verificationRequest = await serverClient.query(
          q.Create(q.Collection('verificationRequests'), {
            data: {
              identifier,
              token: hashedToken,
              expires,
              id: uuidv4(),
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
          })
        )

        // With the verificationCallback on a provider, you can send an email, or queue
        // an email to be sent, or perform some other action (e.g. send a text message)
        await sendVerificationRequest({ identifier, url, token, baseUrl, provider })

        return verificationRequest
      } catch (error) {
        return Promise.reject(new Error('CREATE_VERIFICATION_REQUEST_ERROR', error))
      }
    }

    async function getVerificationRequest (identifier, token, secret, provider) {
      console.log('-----------getVerificationRequest------------')
      // console.log((identifier, token, secret, provider));
      try {
        // Hash token provided with secret before trying to match it with database
        // @TODO Use bcrypt instead of salted SHA-256 hash for token
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        const verificationRequest = await serverClient.query(
          q.Let(
            {
              ref: q.Match(q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN), hashedToken)
            },
            q.If(q.Exists(q.Var('ref')), q.Select('data', q.Get(q.Var('ref'))), null)
          )
        )

        if (
          verificationRequest &&
                    verificationRequest.expires &&
                    new Date() > verificationRequest.expires
        ) {
          // Delete verification entry so it cannot be used again
          await serverClient.query(
            q.Delete(
              q.Select(
                'ref',
                q.Get(
                  q.Match(
                    q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN),
                    hashedToken
                  )
                )
              )
            )
          )
          return null
        }

        return verificationRequest
      } catch (error) {
        console.error('GET_VERIFICATION_REQUEST_ERROR', error)
        return Promise.reject(new Error('GET_VERIFICATION_REQUEST_ERROR', error))
      }
    }

    async function deleteVerificationRequest (identifier, token, secret, provider) {
      console.log('-----------deleteVerificationRequest------------')
      try {
        // Delete verification entry so it cannot be used again
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        await serverClient.query(
          q.Delete(
            q.Select(
              'ref',
              q.Get(q.Match(q.Index(INDEX_VERIFICATION_REQUESTS_TOKEN), hashedToken))
            )
          )
        )
      } catch (error) {
        console.error('DELETE_VERIFICATION_REQUEST_ERROR', error)
        return Promise.reject(new Error('DELETE_VERIFICATION_REQUEST_ERROR', error))
      }
    }

    return Promise.resolve({
      createUser,
      getUser,
      getUserByEmail,
      getUserByProviderAccountId,
      updateUser,
      linkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession,
      createVerificationRequest,
      getVerificationRequest,
      deleteVerificationRequest
    })
  }

  return {
    getAdapter
  }
}

export default {
  Adapter
}
