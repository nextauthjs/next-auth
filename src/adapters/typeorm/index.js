import 'reflect-metadata'
import { createConnection, getConnection, getManager, EntitySchema } from 'typeorm'
import { createHash } from 'crypto'

import { CreateUserError } from '../../lib/errors'
import Models from './models'

const Adapter = (config, options = {}) => {
  // If the input is URL string, automatically convert the string to an object
  // to make configuration easier (in most use cases).
  //
  // TypeORM accepts connection string as a 'url' option, but unfortunately
  // not for all databases (e.g. SQLite) so we handle it ourselves.
  //
  // @TODO Move this into a function (e.g. lib/parse-database-url)
  if (typeof config === 'string') {
    try {
      const parsedUrl = new URL(config)
      config = {}
      config.type = parsedUrl.protocol.replace(/:$/, '')
      config.host = parsedUrl.hostname
      config.port = Number(parsedUrl.port)
      config.username = parsedUrl.username
      config.password = parsedUrl.password
      config.database = parsedUrl.pathname.replace(/^\//, '')

      if (parsedUrl.search) {
        parsedUrl.search.replace(/^\?/, '').split('&').forEach(keyValuePair => {
          let [key, value] = keyValuePair.split('=')
          // Converts true/false strings to actual boolean values
          if (value === 'true') { value = true }
          if (value === 'false') { value = false }
          config[key] = value
        })
      }
    } catch (error) {
      // If URL parsing fails for any reason, try letting TypeORM handle it
      config = {
        url: config
      }
    }
  }

  // Load models / schemas (check for custom models / schemas first)
  const Account = options.Account ? options.Account.model : Models.Account.model
  const AccountSchema = options.Account ? options.Account.schema : Models.Account.schema

  const User = options.User ? options.User.model : Models.User.model
  const UserSchema = options.User ? options.User.schema : Models.User.schema

  const Session = options.Session ? options.Session.model : Models.Session.model
  const SessionSchema = options.Session ? options.Session.schema : Models.Session.schema

  const VerificationRequest = options.VerificationRequest ? options.VerificationRequest.model : Models.VerificationRequest.model
  const VerificationRequestSchema = options.VerificationRequest ? options.VerificationRequest.schema : Models.VerificationRequest.schema

  // Models default to being suitable for ANSI SQL database
  // Some flexiblity is required to support non-SQL databases
  let idKey = 'id'

  // Some custom logic is required to make schemas compatible with MongoDB
  // Here we monkey patch some properties if MongoDB is being used.
  if (config.type === 'mongodb') {
    // Important!
    //
    // 1. You must set 'objectId: true' on one property on a model.
    //
    //   'objectId' MUST be set on the primary ID field. This overrides other
    //   values on that object in TypeORM (e.g. type: 'int' or 'primary').
    //
    // 2. Other properties that are Object IDs in the same model MUST be set to
    //    type: 'objectId'
    //
    //    If you set 'objectId: true' on multiple properties on a model you will
    //    see the result of queries like find() is wrong. You will see the same
    //    Object ID in every property of type Object ID in the result (but the
    //    database will look fine). Use type = 'objectId' for them instead!
    //
    // @TODO Look at refactoring to see if there is a better way to do this that
    // doesn't rely on hard coding this transformation on a per property basis
    AccountSchema.columns.id.objectId = true
    AccountSchema.columns.userId.type = 'objectId'
    UserSchema.columns.id.objectId = true
    SessionSchema.columns.id.objectId = true
    SessionSchema.columns.userId.type = 'objectId'
    VerificationRequestSchema.columns.id.objectId = true
  }

  // SQLite does not support `timestamp` fields so we remap them to `datetime`
  // NB: `timestamp` is an ANSI SQL specification and widely supported elsewhere
  //
  // @TODO Refactor to apply automatically to all `timestamp` properties if the
  // database is MySQL.
  if (config.type === 'sqlite') {
    AccountSchema.columns.accessTokenExpires.type = 'datetime'
    SessionSchema.columns.sessionExpires.type = 'datetime'
    VerificationRequestSchema.columns.expires.type = 'datetime'
  }

  // Parse config (uses options)
  const defaultConfig = {
    name: 'default',
    autoLoadEntities: true,
    entities: [
      new EntitySchema(AccountSchema),
      new EntitySchema(UserSchema),
      new EntitySchema(SessionSchema),
      new EntitySchema(VerificationRequestSchema)
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

    let ObjectId // Only defined if the database is MongoDB
    if (config.type === 'mongodb') {
      // MongoDB uses _id (rather than id) for primary keys and TypeORM does not
      // fully abstract this (e.g. the way Mongoose does), so we need to do it.
      // Note: We don't need to change the values in the schemas, just in queries
      // that we make, so it's a variable here.
      idKey = '_id'
      const mongodb = await import('mongodb')
      ObjectId = mongodb.ObjectId
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

      // In the very specific case of both using JWT for storing session data
      // and using MongoDB to store user data, the ID is a string rather than
      // an ObjectId and we need to turn it into an ObjectId.
      //
      // In all other scenarios it is already an ObjectId, because it will have
      // come from another MongoDB query. 
      if (ObjectId && !(id instanceof ObjectId)) {
        id = ObjectId(id)
      }

      try {
        return connection.getRepository(User).findOne({ [idKey]: id })
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
        return connection.getRepository(User).findOne({ [idKey]: account.userId })
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
            session.sessionExpires = newExpiryDate.toISOString()
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

    async function createVerificationRequest (identifer, url, token, secret, provider) {
      _debug('createVerificationRequest', identifer)
      try {
        const { site, verificationMaxAge } = appOptions
        const { sendVerificationRequest } = provider

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
        const newVerificationRequest = new VerificationRequest(identifer, hashedToken, expires)
        const verificationRequest = await getManager().save(newVerificationRequest)

        // With the verificationCallback on a provider, you can send an email, or queue
        // an email to be sent, or perform some other action (e.g. send a text message)
        await sendVerificationRequest({ identifer, url, token, site, provider })

        return verificationRequest
      } catch (error) {
        console.error('CREATE_VERIFICATION_REQUEST_ERROR', error)
        return Promise.reject(new Error('CREATE_VERIFICATION_REQUEST_ERROR', error))
      }
    }

    async function getVerificationRequest (identifer, token, secret, provider) {
      _debug('getVerificationRequest', identifer, token)
      try {
        // Hash token provided with secret before trying to match it with datbase
        // @TODO Use bcrypt function here instead of simple salted hash
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        const verificationRequest = await connection.getRepository(VerificationRequest).findOne({ identifer, token: hashedToken })

        if (verificationRequest && verificationRequest.expires && new Date() > new Date(verificationRequest.expires)) {
          // Delete verification entry so it cannot be used again
          await connection.getRepository(VerificationRequest).delete({ token: hashedToken })
          return null
        }

        return verificationRequest
      } catch (error) {
        console.error('GET_VERIFICATION_REQUEST_ERROR', error)
        return Promise.reject(new Error('GET_VERIFICATION_REQUEST_ERROR', error))
      }
    }

    async function deleteVerificationRequest (identifer, token, secret, provider) {
      _debug('deleteVerification', identifer, token)
      try {
        // Delete verification entry so it cannot be used again
        const hashedToken = createHash('sha256').update(`${token}${secret}`).digest('hex')
        await connection.getRepository(VerificationRequest).delete({ token: hashedToken })
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
      getUserByCredentials,
      updateUser,
      deleteUser,
      linkAccount,
      unlinkAccount,
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
  Adapter,
  Models
}
