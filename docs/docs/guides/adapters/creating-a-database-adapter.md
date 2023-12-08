---
title: Creating a database adapter
---

Custom adapters allow you to integrate with any (even multiple) database/back-end service, even if we don't have an [official package](https://github.com/nextauthjs/next-auth/tree/main/packages) available yet. The only requirement is that your database can support the [models](/reference/core/adapters#models) that Auth.js expects.

_See the code below for a practical example._

### Example code

```ts
import type { Adapter } from '@auth/core/adapters'

export function MyAdapter(client, options = {}): Adapter {
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
    async getUserByAccount({ providerAccountId, provider }) {
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
    async unlinkAccount({ providerAccountId, provider }) {
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

These methods are required for all sign-in flows:

- `createUser`
- `getUser`
- `getUserByEmail`
- `getUserByAccount`
- `linkAccount`
- `createSession`
- `getSessionAndUser`
- `updateSession`
- `deleteSession`
- `updateUser`

These methods are required to support email / passwordless sign-in:

- `createVerificationToken`
- `useVerificationToken`

### Unimplemented methods

These methods will be required in a future release, but are not yet invoked:

- `deleteUser`
- `unlinkAccount`

### Useful resources

- [Official adapters' source code](https://github.com/nextauthjs/next-auth/tree/main/packages)
- [`Adapter` interface](/reference/core/adapters#adapter)