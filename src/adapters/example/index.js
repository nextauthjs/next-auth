const Adapter = (config, options = {}) => {
  async function getAdapter (appOptions) {
    // Display debug output if debug option enabled
    function _debug (...args) {
      if (appOptions.debug) {
        console.log('[next-auth][debug]', ...args)
      }
    }

    async function createUser (profile) {
      _debug('createUser', profile)
      return null
    }

    async function getUser (id) {
      _debug('getUser', id)
      return null
    }

    async function getUserByEmail (email) {
      _debug('getUserByEmail', email)
      return null
    }

    async function getUserByProviderAccountId (providerId, providerAccountId) {
      _debug('getUserByProviderAccountId', providerId, providerAccountId)
      return null
    }

    async function getUserByCredentials (credentials) {
      _debug('getUserByCredentials', credentials)
      return null
    }

    async function updateUser (user) {
      _debug('updateUser', user)
      return null
    }

    async function deleteUser (userId) {
      _debug('deleteUser', userId)
      return null
    }

    async function linkAccount (userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires) {
      _debug('linkAccount', userId, providerId, providerType, providerAccountId, refreshToken, accessToken, accessTokenExpires)
      return null
    }

    async function unlinkAccount (userId, providerId, providerAccountId) {
      _debug('unlinkAccount', userId, providerId, providerAccountId)
      return null
    }

    async function createSession (user) {
      _debug('createSession', user)
      return null
    }

    async function getSession (sessionToken) {
      _debug('getSession', sessionToken)
      return null
    }

    async function updateSession (session, force) {
      _debug('updateSession', session)
      return null
    }

    async function deleteSession (sessionToken) {
      _debug('deleteSession', sessionToken)
      return null
    }

    async function createVerificationRequest (identifier, url, token, secret, provider) {
      _debug('createVerificationRequest', identifier)
      return null
    }

    async function getVerificationRequest (identifier, token, secret, provider) {
      _debug('getVerificationRequest', identifier, token)
      return null
    }

    async function deleteVerificationRequest (identifier, token, secret, provider) {
      _debug('deleteVerification', identifier, token)
      return null
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
  Adapter
}
