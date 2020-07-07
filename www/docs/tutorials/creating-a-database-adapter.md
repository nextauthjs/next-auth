---
id: creating-a-database-adapter
title: Creating a database adapter
---

Using a custom adapter you can connect to any database backend or even several different databases.

Creating a custom adapter can be considerable undertaking and will require some trial and error and some reverse engineering using the built-in adapters for reference.

## How to create an adapter

From an implementation perspective, an adapter in NextAuth.js is a function which returns an async  `getAdapter()` method, which in turn returns a Promise with a list of functions used to handle operations such as creating user, linking a user and an OAuth account or handling reading and writing sessions.

It uses this approach to allow database connection logic to live in the `getAdapter()` method. By calling the function just before an action needs to happen, it is possible to check database connection status and handle connecting / reconnecting to a database as required.

_See the code below for practical example._

### Required methods

These methods are required for all sign in flows:

* createUser
* getUser
* getUserByEmail  
* getUserByProviderAccountId
* linkAccount
* createSession
* getSession
* updateSession
* deleteSession
* updateUser

These methods are required to support email / passwordless sign in:

* createVerificationRequest
* getVerificationRequest
* deleteVerificationRequest

### Unimplemented methods

These methods will be required in a future release, but are not yet invoked:

* getUserByCredentials
* deleteUser
* unlinkAccount

### Example code

```js
const Adapter = (config, options = {}) => {

  async function getAdapter (appOptions) {

    async function createUser (profile) {
      return null
    }

    async function getUser (id) {
      return null
    }

    async function getUserByEmail (email) {
      return null
    }

    async function getUserByProviderAccountId (
      providerId,
      providerAccountId
    ) {
      return null
    }

    async function getUserByCredentials (credentials) {
      return null
    }

    async function updateUser (user) {
      return null
    }

    async function deleteUser (userId) {
      return null
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
      return null
    }

    async function unlinkAccount (
      userId,
      providerId,
      providerAccountId
    ) {
      return null
    }

    async function createSession (user) {
      return null
    }

    async function getSession (sessionToken) {
      return null
    }

    async function updateSession (
      session,
      force
    ) {
      return null
    }

    async function deleteSession (sessionToken) {
      return null
    }

    async function createVerificationRequest (
      identifier,
      url,
      token,
      secret,
      provider
    ) {
      return null
    }

    async function getVerificationRequest (
      identifier,
      token,
      secret,
      provider
    ) {
      return null
    }

    async function deleteVerificationRequest (
      identifier,
      token,
      secret,
      provider
    ) {
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
```
