/**
 * Extends logger code with a prefix
 * @param {string} prefix
 * @param {import("../../lib/logger").LoggerInstance} logger
 */
function prefixLogger (prefix, logger) {
  return {
    debug (code, ...args) { logger.debug(`${prefix}_${code}`, ...args) },
    warn (code, ...args) { logger.warn(`${prefix}_${code}`, ...args) },
    error (code, ...args) { logger.error(`${prefix}_${code}`, ...args) }
  }
}

/** @type {import("../adapter").Adapter} */
export function Adapter (config, options = {}) {
  // Initialize adapter here
  return {
    async getAdapter (appOptions) {
      const logger = prefixLogger('ADAPTER', appOptions.logger)
      return {
        async createUser (profile) {
          logger.debug('createUser', { profile })
          return null
        },
        async getUser (id) {
          logger.debug('getUser', { id })
          return null
        },
        async getUserByEmail (email) {
          logger.debug('getUserByEmail', { email })
          return null
        },
        async getUserByProviderAccountId (providerId, providerAccountId) {
          logger.debug('getUserByProviderAccountId', { providerId, providerAccountId })
          return null
        },
        async updateUser (user) {
          logger.debug('updateUser', { user })
          return null
        },
        async deleteUser (userId) {
          logger.debug('deleteUser', { userId })
          return null
        },
        async linkAccount (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
          logger.debug('linkAccount', { userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires })
          return null
        },
        async unlinkAccount (userId, providerId, providerAccountId) {
          logger.debug('unlinkAccount', { userId, providerId, providerAccountId })
          return null
        },
        async createSession (user) {
          logger.debug('createSession', { user })
          return null
        },
        async getSession (sessionToken) {
          logger.debug('getSession', { sessionToken })
          return null
        },
        async updateSession (session, force) {
          logger.debug('updateSession', { session })
          return null
        },
        async deleteSession (sessionToken) {
          logger.debug('deleteSession', { sessionToken })
          return null
        },
        async createVerificationRequest (identifier, url, token, secret, provider) {
          logger.debug('createVerificationRequest', { identifier })
          return null
        },
        async getVerificationRequest (identifier, token, secret, provider) {
          logger.debug('getVerificationRequest', { identifier, token })
          return null
        },
        async deleteVerificationRequest (identifier, token, secret, provider) {
          logger.debug('deleteVerification', { identifier, token })
          return null
        }
      }
    }
  }
}
