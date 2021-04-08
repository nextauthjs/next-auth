---
id: eveonline
title: EVE Online
---

## Documentation

https://developers.eveonline.com/blog/article/sso-to-authenticated-calls

## Configuration

https://developers.eveonline.com/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.EVEOnline({
    clientId: process.env.EVE_CLIENT_ID,
    clientSecret: process.env.EVE_CLIENT_SECRET
  })
]
...
```

:::tip When creating your application, make sure to select `Authentication Only` as the connection type.

:::tip If using JWT for the session, you can add the `CharacterID` to the JWT token and session. Example:

```js
...
options: {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (profile) {
        token = {
          ...token,
          id: profile.CharacterID,
        }
      }
      return token;
    },
    session: async (session, token) => {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
}
...
```
