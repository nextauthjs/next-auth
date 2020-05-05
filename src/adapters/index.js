import 'reflect-metadata'
import { createConnection, getConnection, getManager, EntitySchema } from 'typeorm'

import Models from '../models'

const Default = (config, options) => {
  // Parse options before parsing config as we need to load any custom models or schemas first
  const defaultOptions = {}

  options = {
    ...defaultOptions,
    ...options
  }

  const Account = options.Account ? options.Account.model : Models.Account.model
  const AccountSchema = options.Account ? options.Account.schema : Models.Account.schema

  const User = options.User ? options.User.model :  Models.User.model
  const UserSchema = options.User ? options.User.schema :  Models.User.schema

  const Session = options.Session ? options.Session.model :  Models.Session.model
  const SessionSchema = options.Session ? options.Session.schema :  Models.Session.schema

  // Parse config (uses options)
  const defaultConfig = {
    name: 'default',
    autoLoadEntities: true,
    entities: [
      new EntitySchema(AccountSchema),
      new EntitySchema(UserSchema),
      new EntitySchema(SessionSchema)
    ],
    synchronize: true,
    logging: false,
  }

  config = {
    ...defaultConfig,
    ...config
  }

  function debug(...args) {
    if (process.env.NODE_ENV === 'development')
      console.log(...args)
  }
  let connection = null

  async function getAdapter() {

    // Helper function to reuse / restablish connections
    // (useful if they drop when after being idle)
    async function getDatabaseConnection() {
      return new Promise(async resolve => {
        // Get current connection by name
        connection = getConnection(config.name)

        // If connection is no longer established, reconnect
        if (!connection.isConnected)
          connection = await connection.connect()

        resolve()
      })
    }
    
    if (!connection) {
      // If no connection, create new connection
      try {
        connection = await createConnection(config)
      } catch (error) {
        if (error.name === "AlreadyHasActiveConnectionError") {
          // If creating connection fails because it's already
          // been re-established, check it's really up
          await getDatabaseConnection()
        } else {
          console.error('ADAPTER_CONNECTION_ERROR', error)
        }
      }
    } else {
      // If the connection object already exists, ensure it's valid
      await getDatabaseConnection()
    }
  
    // Called when a user signs in
    async function createUser(profile) {
      debug('Create user account', profile)
      return new Promise(async (resolve, reject) => {
        try {
          // Create user account
          const user = new User(profile.name, profile.email, profile.image)
          await getManager().save(user)
          resolve(user)
        } catch (error) {
          // Reject if fails
          console.error('CREATE_USER_ERROR', error)
          reject(new Error('CREATE_USER_ERROR', error))
        }
      })
    }

    async function updateUser(user) {
      debug('Update user account', user)
      return new Promise((resolve, reject) => {
        // @TODO Save changes to user object in DB
        resolve(true)
      })
    }

    async function getUserById(id) {
      debug('Get user account by ID', id)
      return new Promise(async (resolve, reject) => {
        try {
          const user = await connection.getRepository(User).findOne({ id: id })
          resolve(user)
        } catch (error) {
          console.error('GET_USER_BY_ID_ERROR', error)
          reject(new Error('GET_USER_BY_ID_ERROR', error))
        }
      })
    }

    async function getUserByProviderAccountId(provider, providerAccountId) {
      debug('Get user account by provider account ID', provider, providerAccountId)
      return new Promise((resolve, reject) => {
        // @TODO Get user from DB
        resolve(false)
      })
    }

    async function getUserByEmail(email) {
      debug('Get user account by email address', email)
      return new Promise((resolve, reject) => {
        // @TODO Get user from DB
        resolve(false)
      })
    }

    async function getUserByCredentials(credentials) {
      debug('Get user account by credentials', credentials)
      return new Promise((resolve, reject) => {
        // @TODO Get user from DB
        resolve(true)
      })
    }


    async function deleteUserById(userId) {
      debug('Delete user account', userId)
      return new Promise((resolve, reject) => {
        // @TODO Delete user from DB
        resolve(true)
      })
    }

    async function linkAccount(userId, providerId, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
      debug('Link provider account', userId, providerId, providerAccountId, refreshToken, accessToken, accessTokenExpires)
      return new Promise(async (resolve, reject) => {
        try {
          // Create user account
          const account = new Account(userId, providerId, providerAccountId, refreshToken, accessToken, accessTokenExpires)
          await getManager().save(account)
          resolve(account)
        } catch (error) {
          // Reject if fails
          console.error('LINK_ACCOUNT_ERROR', error)
          reject(new Error('LINK_ACCOUNT_ERROR', error))
        }
      })
    }

    async function unlinkAccount(userId, providerId, providerAccountId) {
      debug('Unlink provider account', userId, providerId, providerAccountId)
      return new Promise((resolve, reject) => {
        // @TODO Get current user from DB
        // @TODO Delete [provider] object from user object
        // @TODO Save changes to user object in DB
        resolve(true)
      })
    }

    async function createSession(user) {
      debug('Create session for user', user)
      return new Promise(async (resolve, reject) => {
        const session = new Session(user.id)
        await getManager().save(session)
        resolve(session)
      })
    }

    async function getSessionById(id) {
      debug('Get session by ID', id)
      return new Promise(async (resolve, reject) => {
        try {
          const session = await connection.getRepository(Session).findOne({ id })
          // @TODO Check session has not expired
          resolve(session)
        } catch (error) {
          console.error('GET_SESSION_BY_ID_ERROR', error)
          reject(new Error('GET_SESSION_BY_ID_ERROR', error))
        }
      })
    }

    async function deleteSessionById(id) {
      debug('Delete session by ID', id)
      return new Promise((resolve, reject) => {
        // @TODO Delete session
        resolve(true)
      })
    }

    return Promise.resolve({
      createUser,
      updateUser,
      getUserById,
      getUserByProviderAccountId,
      getUserByEmail,
      getUserByCredentials,
      deleteUserById,
      linkAccount,
      unlinkAccount,
      createSession,
      getSessionById,
      deleteSessionById
    })
  }

  return {
    getAdapter
  }
}

export default {
  Default
}


