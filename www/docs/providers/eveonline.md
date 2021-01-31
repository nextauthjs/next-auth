---
id: eveonline
title: EVEOnline
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

:::tip If using JWT for the session, you can add the `CharacterID`, `CharacterName`, and `image` to the JWT token and session. Example:

```js
...
options: {
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (profile) {
        token = {
          id: profile.CharacterID,
          name: profile.CharacterName,
          image: `https://image.eveonline.com/Character/${profile.CharacterID}_128.jpg`,
        }
      }
      return token;
    },
    session: async (session, token) => {
      if (token) {
        session.id = token.id;
        session.name = token.name;
        session.image = token.image;
      }
      return session;
    }
  }
}
...
```
