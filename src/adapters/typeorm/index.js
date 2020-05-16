import 'reflect-metadata'
import { createConnection, getConnection, getManager, EntitySchema } from 'typeorm'
import { createHash } from 'crypto'

import { CreateUserError } from '../../lib/errors'
import Models from './models'

const Adapter = (config, options) => {
  // Parse options before parsing config as we need to load any custom models or schemas first
  const defaultOptions = {}

  options = {
    ...defaultOptions,
    ...options
  }

  const Account = options.Account ? options.Account.model : Models.Account.model
  const AccountSchema = options.Account ? options.Account.schema : Models.Account.schema

  const User = options.User ? options.User.model : Models.User.model
  const UserSchema = options.User ? options.User.schema : Models.User.schema

  const Session = options.Session ? options.Session.model : Models.Session.model
  const SessionSchema = options.Session ? options.Session.schema : Models.Session.schema

  const EmailVerification = options.EmailVerification ? options.EmailVerification.model : Models.EmailVerification.model
  const EmailVerificationSchema = options.EmailVerification ? options.EmailVerification.schema : Models.EmailVerification.schema

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

  // A quick and dirty way for folks to be able to debug
  function debug (...args) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG]', ...args)
    }
  }

  debug('Development mode; debug output enabled')

  let connection = null

  async function getAdapter () {
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

    // Called when a user signs in
    async function createUser (profile) {
      debug('Create user', profile)
      try {
        // Create user account
        const user = new User(profile.name, profile.email, profile.image)
        return await getManager().save(user)
      } catch (error) {
        console.error('CREATE_USER_ERROR', error)
        return Promise.reject(new CreateUserError(error))
      }
    }

    async function updateUser (user) {
      debug('Update user', user)
      // @TODO Save changes to user object in DB
      return false
    }

    async function getUser (id) {
      debug('Get user', id)
      try {
        return connection.getRepository(User).findOne({ id })
      } catch (error) {
        console.error('GET_USER_BY_ID_ERROR', error)
        return Promise.reject(new Error('GET_USER_BY_ID_ERROR', error))
      }
    }

    async function getUserByProviderAccountId (providerId, providerAccountId) {
      debug('Get user by provider account ID', providerId, providerAccountId)
      try {
        const account = await connection.getRepository(Account).findOne({ providerId, providerAccountId })
        if (!account) { return null }
        return connection.getRepository(User).findOne({ id: account.userId })
      } catch (error) {
        console.error('GET_USER_BY_POVIDER_ACCOUNT_ID_ERROR', error)
        return Promise.reject(new Error('GET_USER_BY_POVIDER_ACCOUNT_ID_ERROR', error))
      }
    }

    async function getUserByEmail (email) {
      debug('Get user by email address', email)
      // @TODO Get user from DB
      return false
    }

    async function getUserByCredentials (credentials) {
      debug('Get user by credentials', credentials)
      // @TODO Get user from DB
      return false
    }

    async function deleteUser (userId) {
      debug('Delete user', userId)
      // @TODO Delete user from DB
      return false
    }

    async function linkAccount (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
      debug('Link provider account', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires)
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
      debug('Unlink provider account', userId, providerId, providerAccountId)
      // @TODO Get current user from DB
      // @TODO Delete [provider] object from user object
      // @TODO Save changes to user object in DB
      return false
    }

    async function createSession (user) {
      debug('Create session', user)
      try {
        const session = new Session(user.id)
        return getManager().save(session)
      } catch (error) {
        console.error('CREATE_SESSION_ERROR', error)
        return Promise.reject(new Error('CREATE_SESSION_ERROR', error))
      }
    }

    async function getSession (sessionToken) {
      debug('Get session', sessionToken)
      try {
        const session = await connection.getRepository(Session).findOne({ sessionToken })
        // @TODO Check session has not expired (return null if it has)
        return session
      } catch (error) {
        console.error('GET_SESSION_ERROR', error)
        return Promise.reject(new Error('GET_SESSION_ERROR', error))
      }
    }

    async function deleteSession (sessionToken) {
      debug('Delete session', sessionToken)
      try {
        return await connection.getRepository(Session).delete({ sessionToken })
      } catch (error) {
        console.error('DELETE_SESSION_ERROR', error)
        return Promise.reject(new Error('DELETE_SESSION_ERROR', error))
      }
    }

    async function createEmailVerification (email, url, token, secret, provider, options) {
      debug('Create verification request', email)
      try {
        const { site } = options
        const { verificationCallback } = provider

        // Store hashed token (using secret as salt) so that tokens cannot be exploited
        // even if the contents of the database is compromised.
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')

        // Save to database
        const newEmailVerification = new EmailVerification(email, hashedToken)
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
      debug('Get verification request', email, token)
      try {
        // Hash token provided with secret before trying to match it with datbase
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        return connection.getRepository(EmailVerification).findOne({ email, token: hashedToken })
      } catch (error) {
        console.error('GET_EMAIL_VERIFICATION_ERROR', error)
        return Promise.reject(new Error('GET_EMAIL_VERIFICATION_ERROR', error))
      }
    }

    async function deleteEmailVerification (email, token, secret, provider) {
      debug('Delete verification request', email, token)
      try {
        // When a verification request is accepted, delete all of them associated with that same email address
        // We could just delete the current one, but it's useful.
        return await connection.getRepository(EmailVerification).delete({ email })
      } catch (error) {
        console.error('DELETE_EMAIL_VERIFICATION_ERROR', error)
        return Promise.reject(new Error('DELETE_EMAIL_VERIFICATION_ERROR', error))
      }
    }

    return Promise.resolve({
      createUser,
      updateUser,
      getUser,
      getUserByProviderAccountId,
      getUserByEmail,
      getUserByCredentials,
      deleteUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSession,
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
