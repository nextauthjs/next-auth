---
id: creating-a-database-adapter
title: Create an adapter
---

Using a custom adapter you can connect to any database back-end or even several different databases. Official adapters created and maintained by our community can be found in the [adapters repository](https://github.com/nextauthjs/adapters). Feel free to add a custom adapter from your project to the repository, or even become a maintainer of a certain adapter. Custom adapters can still be created and used in a project without being added to the repository.

## How to create an adapter

_See the code below for practical example._

### Example code

```ts
/** @return { import("next-auth/adapters").Adapter } */
export default function MyAdapter(client, options = {}) {
  return {
    async createUser(user) {
      return
    },
    async getUser(id) {
      return
    },
    async getUserByEmail(email) {
      return
    },
    async getUserByAccount({ provider, id }) {
      return
    },
    async updateUser(user) {
      return
    },
    async deleteUser(userId) {
      return
    },
    async linkAccount(account) {
      return
    },
    async unlinkAccount({ provider, id }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      return
    },
    async getSessionAndUser(sessionToken) {
      return
    },
    async updateSession({ sessionToken }) {
      return
    },
    async deleteSession(sessionToken) {
      return
    },
    async createVerificationToken({ identifier, expires, token }) {
      return
    },
    async useVerificationToken({ identifier, token }) {
      return
    },
  }
}
```


### Required methods

These methods are required for all sign in flows:

* `createUser`
* `getUser`
* `getUserByEmail`
* `getUserByAccount`
* `linkAccount`
* `createSession`
* `getSessionAndUser`
* `updateSession`
* `deleteSession`
* `updateUser`

These methods are required to support email / passwordless sign in:

* `createVerificationToken`
* `useVerificationToken`

### Unimplemented methods

These methods will be required in a future release, but are not yet invoked:

* `deleteUser`
* `unlinkAccount`

