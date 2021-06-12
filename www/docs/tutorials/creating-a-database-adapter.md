---
id: creating-a-database-adapter
title: Creating a database adapter
---

Using a custom adapter you can connect to any database backend or even several different databases.  Custom adapters created and maintained by our community can be found in the [adapters repository](https://github.com/nextauthjs/adapters). Feel free to add a custom adapter from your project to the repository, or even become a maintainer of a certain adapter. Custom adapters can still be created and used in a project without being added to the repository.

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

* deleteUser
* unlinkAccount

### Example code

```js
export default function YourAdapter (config, options = {}) {
  return {
    async getAdapter (appOptions) {
      async createUser (profile) {
        return null
      },
      async getUser (id) {
        return null
      },
      async getUserByEmail (email) {
        return null
      },
      async getUserByProviderAccountId (
        providerId,
        providerAccountId
      ) {
        return null
      },
      async updateUser (user) {
        return null
      },
      async deleteUser (userId) {
        return null
      },
      async linkAccount (
        userId,
        providerId,
        providerType,
        providerAccountId,
        refreshToken,
        accessToken,
        accessTokenExpires
      ) {
        return null
      },
      async unlinkAccount (
        userId,
        providerId,
        providerAccountId
      ) {
        return null
      },
      async createSession (user) {
        return null
      },
      async getSession (sessionToken) {
        return null
      },
      async updateSession (
        session,
        force
      ) {
        return null
      },
      async deleteSession (sessionToken) {
        return null
      },
      async createVerificationRequest (
        identifier,
        url,
        token,
        secret,
        provider
      ) {
        return null
      },
      async getVerificationRequest (
        identifier,
        token,
        secret,
        provider
      ) {
        return null
      },
      async deleteVerificationRequest (
        identifier,
        token,
        secret,
        provider
      ) {
        return null
      }
    }
  }
}
```
