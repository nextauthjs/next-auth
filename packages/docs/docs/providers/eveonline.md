---
id: eveonline
title: EVE Online
---

## Documentation

https://developers.eveonline.com/blog/article/sso-to-authenticated-calls

## Configuration

https://developers.eveonline.com/

## Options

The **EVE Online Provider** comes with a set of default options:

- [EVE Online Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/eveonline.ts)

You can override any of the options to suit your own use case.

## Example

```js
import EVEOnlineProvider from "next-auth/providers/eveonline";
...
providers: [
  EVEOnlineProvider({
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
    session: async ({ session, token }) => {
      session.user.id = token.id;
      return session;
    }
  }
}
...
```
