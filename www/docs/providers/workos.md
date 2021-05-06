---
id: workos
title: WorkOS
---

## Documentation

https://workos.com/docs/sso/guide

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.WorkOS({
    clientId: process.env.WORKOS_ID,
    clientSecret: process.env.WORKOS_SECRET,
    domain: process.env.WORKOS_DOMAIN
  }),
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      if (profile?.first_name) {
        // add any WorkOS profile properties you want to access client side here
        token.firstName = profile.first_name
      }
      return token
    },
    async session(session, user) {
      // add any WorkOS profile properties you want to access client side here
      session.user.firstName = user.firstName
      return session
    }
  },
],
...
```
