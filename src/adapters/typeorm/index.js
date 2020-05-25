import 'reflect-metadata'
import { createConnection, getConnection, getManager, EntitySchema } from 'typeorm'
import { createHash } from 'crypto'

import { CreateUserError } from '../../lib/errors'
import Models from './models'

const Adapter = (config, options = {}) => {
  // Load models / schemas (check for custom models / schemas first)
  const Account = options.Account ? options.Account.model : Models.Account.model
  const AccountSchema = options.Account ? options.Account.schema : Models.Account.schema

  const User = options.User ? options.User.model : Models.User.model
  const UserSchema = options.User ? options.User.schema : Models.User.schema

  const Session = options.Session ? options.Session.model : Models.Session.model
  const SessionSchema = options.Session ? options.Session.schema : Models.Session.schema

  const EmailVerification = options.EmailVerification ? options.EmailVerification.model : Models.EmailVerification.model
  const EmailVerificationSchema = options.EmailVerification ? options.EmailVerification.schema : Models.EmailVerification.schema

  // Models default to being suitable for ANSI SQL database
  // Some flexiblity is required to support non-SQL databases
  const idKey = 'id'
  const getById = (id) => id

  /* @TODO This is a work in progress
  // Some custom logic is required to make schemas compatible with MongoDB
  if (config.type === 'mongodb') {
    if (!options.mongodb) throw new Error('Experimental feature')

    idKey = 'id'
    AccountSchema.columns.id.objectId = true
    AccountSchema.columns.userId.objectId = true
    UserSchema.columns.id.objectId = true
    SessionSchema.columns.id.objectId = true
    SessionSchema.columns.userId.objectId = true
    EmailVerificationSchema.columns.id.objectId = true

    getById = (id) => {
      console.log('fancy getById', id)
      return config.mongodb.ObjectId(id)
    }
  }
  */

  // Parse config (uses options)
  const defaultConfig = {
    name: 'default',
    autoLoadEntities: true,
    entities: [
      new EntitySchema(AccountSchema),
      new EntitySchema(UserSchema),
      new EntitySchema(SessionSchema),
      new EntitySchema(EmailVerificationSchema)
    ],
    logging: false
  }

  config = {
    ...defaultConfig,
    ...config
  }

  let connection = null

  async function getAdapter (appOptions) {
    // Helper function to reuse / restablish connections
    // (useful if they drop when after being idle)
    async function _connect () {
      // Get current connection by name
      connection = getConnection(config.name)

      // If connection is no longer established, reconnect
      if (!connection.isConnected) { connection = await connection.connect() }
    }

    if (!connection) {
      // If no connection, create new connection
      try {
        connection = await createConnection(config)
      } catch (error) {
        if (error.name === 'AlreadyHasActiveConnectionError') {
          // If creating connection fails because it's already
          // been re-established, check it's really up
          await _connect()
        } else {
          console.error('ADAPTER_CONNECTION_ERROR', error)
        }
      }
    } else {
      // If the connection object already exists, ensure it's valid
      await _connect()
    }

    // Display debug output if debug option enabled
    function _debug (...args) {
      if (appOptions.debug) {
        console.log('[NextAuth.js][DEBUG]', ...args)
      }
    }

    async function createUser (profile) {
      _debug('createUser', profile)
      try {
        // Create user account
        const user = new User(profile.name, profile.email, profile.image)
        return await getManager().save(user)
      } catch (error) {
        console.error('CREATE_USER_ERROR', error)
        return Promise.reject(new CreateUserError(error))
      }
    }

    async function getUser (id) {
      _debug('getUser', id)
      try {
        return connection.getRepository(User).findOne({ [idKey]: getById(id) })
      } catch (error) {
        console.error('GET_USER_BY_ID_ERROR', error)
        return Promise.reject(new Error('GET_USER_BY_ID_ERROR', error))
      }
    }

    async function getUserByEmail (email) {
      _debug('getUserByEmail', email)
      try {
        return connection.getRepository(User).findOne({ email })
      } catch (error) {
        console.error('GET_USER_BY_EMAIL_ERROR', error)
        return Promise.reject(new Error('GET_USER_BY_EMAIL_ERROR', error))
      }
    }

    async function getUserByProviderAccountId (providerId, providerAccountId) {
      _debug('getUserByProviderAccountId', providerId, providerAccountId)
      try {
        const account = await connection.getRepository(Account).findOne({ providerId, providerAccountId })
        if (!account) { return null }
        return connection.getRepository(User).findOne({ [idKey]: getById(account.userId) })
      } catch (error) {
        console.error('GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR', error)
        return Promise.reject(new Error('GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR', error))
      }
    }

    async function getUserByCredentials (credentials) {
      _debug('getUserByCredentials', credentials)
      // @TODO Get user from DB
      return false
    }

    async function updateUser (user) {
      _debug('updateUser', user)
      // @TODO Save changes to user object in DB
      return false
    }

    async function deleteUser (userId) {
      _debug('deleteUser', userId)
      // @TODO Delete user from DB
      return false
    }

    async function linkAccount (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
      _debug('linkAccount', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires)
      try {
        // Create provider account linked to user
        const account = new Account(userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires)
        return getManager().save(account)
      } catch (error) {
        console.error('LINK_ACCOUNT_ERROR', error)
        return Promise.reject(new Error('LINK_ACCOUNT_ERROR', error))
      }
    }

    async function unlinkAccount (userId, providerId, providerAccountId) {
      _debug('unlinkAccount', userId, providerId, providerAccountId)
      // @TODO Get current user from DB
      // @TODO Delete [provider] object from user object
      // @TODO Save changes to user object in DB
      return false
    }

    async function createSession (user) {
      _debug('createSession', user)
      try {
        const { sessionMaxAge } = appOptions
        let expires = null
        if (sessionMaxAge) {
          const dateExpires = new Date()
          dateExpires.setTime(dateExpires.getTime() + sessionMaxAge)
          expires = dateExpires.toISOString()
        }

        const session = new Session(user.id, null, expires)

        return getManager().save(session)
      } catch (error) {
        console.error('CREATE_SESSION_ERROR', error)
        return Promise.reject(new Error('CREATE_SESSION_ERROR', error))
      }
    }

    async function getSession (sessionToken) {
      _debug('getSession', sessionToken)
      try {
        const session = await connection.getRepository(Session).findOne({ sessionToken })

        // Check session has not expired (do not return it if it has)
        if (session && session.sessionExpires && new Date() > new Date(session.sessionExpires)) {
          // @TODO Delete old sessions from database
          return null
        }

        return session
      } catch (error) {
        console.error('GET_SESSION_ERROR', error)
        return Promise.reject(new Error('GET_SESSION_ERROR', error))
      }
    }

    async function updateSession (session, force) {
      _debug('updateSession', session)
      try {
        const { sessionMaxAge, sessionUpdateAge } = appOptions

        if (sessionMaxAge && (sessionUpdateAge || sessionUpdateAge === 0) && session.sessionExpires) {
          // Calculate last updated date, to throttle write updates to database
          // Formula: ({expiry date} - sessionMaxAge) + sessionUpdateAge
          //     e.g. ({expiry date} - 30 days) + 1 hour
          //
          // Default for sessionMaxAge is 30 days.
          // Default for sessionUpdateAge is 1 hour.
          const dateSessionIsDueToBeUpdated = new Date(session.sessionExpires)
          dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() - sessionMaxAge)
          dateSessionIsDueToBeUpdated.setTime(dateSessionIsDueToBeUpdated.getTime() + sessionUpdateAge)

          // Trigger update of session expiry date and write to database, only
          // if the session was last updated more than {sessionUpdateAge} ago
          if (new Date() > dateSessionIsDueToBeUpdated) {
            const newExpiryDate = new Date()
            newExpiryDate.setTime(newExpiryDate.getTime() + sessionMaxAge)
            session.sessionExpires = newExpiryDate
          } else if (!force) {
            return null
          }
        } else {
          // If sessionMaxAge, sessionUpdateAge or session.sessionExpires are
          // missing then don't even try to save changes, unless force is set.
          if (!force) { return null }
        }

        return getManager().save(session)
      } catch (error) {
        console.error('UPDATE_SESSION_ERROR', error)
        return Promise.reject(new Error('UPDATE_SESSION_ERROR', error))
      }
    }

    async function deleteSession (sessionToken) {
      _debug('deleteSession', sessionToken)
      try {
        return await connection.getRepository(Session).delete({ sessionToken })
      } catch (error) {
        console.error('DELETE_SESSION_ERROR', error)
        return Promise.reject(new Error('DELETE_SESSION_ERROR', error))
      }
    }

    async function createEmailVerification (email, url, token, secret, provider) {
      _debug('createEmailVerification', email)
      try {
        const { site, verificationMaxAge } = appOptions
        const { verificationCallback } = provider

        // Store hashed token (using secret as salt) so that tokens cannot be exploited
        // even if the contents of the database is compromised.
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')

        let expires = null
        if (verificationMaxAge) {
          const dateExpires = new Date()
          dateExpires.setTime(dateExpires.getTime() + verificationMaxAge)
          expires = dateExpires.toISOString()
        }

        // Save to database
        const newEmailVerification = new EmailVerification(email, hashedToken, expires)
        const emailVerification = await getManager().save(newEmailVerification)

        // With the verificationCallback on a provider, you can send an email, or queue
        // an email to be sent, or perform some other action (e.g. send a text message)
        await verificationCallback({ recipient: email, url, token, site, provider })

        return emailVerification
      } catch (error) {
        console.error('CREATE_EMAIL_VERIFICATION_ERROR', error)
        return Promise.reject(new Error('CREATE_EMAIL_VERIFICATION_ERROR', error))
      }
    }

    async function getEmailVerification (email, token, secret, provider) {
      _debug('getEmailVerification', email, token)
      try {
        // Hash token provided with secret before trying to match it with datbase
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        const emailVerification = await connection.getRepository(EmailVerification).findOne({ email, token: hashedToken })

        if (emailVerification && emailVerification.expires && new Date() > new Date(emailVerification.expires)) {
          // Delete email verification so it cannot be used again
          await connection.getRepository(EmailVerification).delete({ token: hashedToken })
          return null
        }

        return emailVerification
      } catch (error) {
        console.error('GET_EMAIL_VERIFICATION_ERROR', error)
        return Promise.reject(new Error('GET_EMAIL_VERIFICATION_ERROR', error))
      }
    }

    async function deleteEmailVerification (email, token, secret, provider) {
      _debug('deleteEmailVerification', email, token)
      try {
        // Delete email verification so it cannot be used again
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        await connection.getRepository(EmailVerification).delete({ token: hashedToken })
      } catch (error) {
        console.error('DELETE_EMAIL_VERIFICATION_ERROR', error)
        return Promise.reject(new Error('DELETE_EMAIL_VERIFICATION_ERROR', error))
      }
    }

    return Promise.resolve({
      createUser,
      getUser,
      getUserByEmail,
      getUserByProviderAccountId,
      getUserByCredentials,
      updateUser,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSession,
      updateSession,
      deleteSession,
      createEmailVerification,
      getEmailVerification,
      deleteEmailVerification
    })
  }

  return {
    getAdapter
  }
}

export default {
  Adapter,
  Models
}
