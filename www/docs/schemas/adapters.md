---
id: adapters
title: Adapters
---

An "*Adapter*" in NextAuth.js is the thing that connects your application to whatever database or backend system you want to use to store data for user accounts, sessions, etc.

You do not need to specify an adapter explicltly unless you want to use advanced options such as custom models or schemas, or if you are creating a custom adapter to connect to a database that is not one of the supported datatabases.

:::tip
*The **adapter** option is currently considered advanced usage intended for use by NextAuth.js contributors.*
:::

## TypeORM (default adapter)

NextAuth.js comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be used with many different databases without any further configuration, you simply add the database driver you want to use to your project and tell  NextAuth.js to use it.

The default adapter comes with predefined models for **Users**, **Sessions**, **Account Linking** and **Verification Emails**. You can extend or replace the default models and schemas, or even provide your adapter to handle reading/writing from the database (or from multiple databases).

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc) and do not have to use the built in models.

If you are using a database that is not supported out of the box, or if you want to use  NextAuth.js with an existing database, or have a more complex setup with accounts and sessions spread across different systems then you can pass your own methods to be called for user and session creation / deletion (etc).

The default adapter is the TypeORM adapter, the following configuration options are exactly equivalent.

```javascript
database: {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
}
```

```javascript
adapter: Adapters.Default({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```

```javascript
adapter: Adapters.TypeORM.Adapter({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```

## Custom adapters

Using a custom adapter you can connect to any database backend or even several different databases.

Creating a custom adapter is considerable undertaking and will require some trial and error and some reverse engineering as it is not currently well documented. The hope and expectation is to grow both the number of included (and third party) adapters over time.

An adapter in NextAuth.js is a function which returns an async  `getAdapter()` method, which in turn returns a Promise with a list of functions used to handle operations such as creating user, linking a user and an OAuth account or handling reading and writing sessions.

It uses this approach to allow database connection logic to live in the `getAdapter()` method. By calling the function just before an action needs to happen, it is possible to check database connection status and handle connecting / reconnecting to a database as required.

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

These methods are required to support email / passwordless sign in:

* createVerificationRequest
* getVerificationRequest
* deleteVerificationRequest

### Unimplemented methods

These methods will be required in a future release, but are not yet invoked:

* getUserByCredentials
* updateUser
* deleteUser
* unlinkAccount

### Example code

An example of adapter structure is shown below:

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
      identifer,
      url,
      token,
      secret,
      provider
    ) {
      return null
    }

    async function getVerificationRequest (
      identifer,
      token,
      secret,
      provider
    ) {
      return null
    }

    async function deleteVerificationRequest (
      identifer,
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
