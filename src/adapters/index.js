import 'reflect-metadata'
import { createConnection, getConnection, getManager, EntitySchema } from 'typeorm'

import { Account, AccountSchema } from '../models/account'
import { User, UserSchema } from '../models/user'

const Default = (config) => {

  function debug(...args) {
    if (process.env.NODE_ENV === 'development')
      console.log(...args)
  }

  const defaultConfig = {
    name: 'default',
    autoLoadEntities: true,
    entities: [
      new EntitySchema(AccountSchema),
      new EntitySchema(UserSchema)
    ],
    synchronize: true,
    logging: false,
  }

  config = {
    ...defaultConfig,
    ...config
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
      return new Promise((resolve, reject) => {
        // @TODO Get user from DB
        resolve(false)
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
      return new Promise((resolve, reject) => {
        // @TODO Create session
        resolve(true)
      })
    }

    async function getSessionById(sessionId) {
      debug('Get session by ID', sessionId)
      return new Promise((resolve, reject) => {
        // @TODO Get session
        resolve(true)
      })
    }

    async function deleteSessionById(sessionId) {
      debug('Delete session by ID', sessionId)
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


