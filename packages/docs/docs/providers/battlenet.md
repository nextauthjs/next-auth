---
id: battle.net
title: Battle.net
---

## Documentation

https://develop.battle.net/documentation/guides/using-oauth

## Configuration

https://develop.battle.net/access/clients

## Options

The **Battle.net Provider** comes with a set of default options:

- [Battle.net Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/battlenet.ts)

You can override any of the options to suit your own use case.

### Issuer

Battle.net operates with account partitions, an issuer should be selected according to [the region](https://develop.battle.net/documentation/guides/regionality-and-apis). If the issuer is omitted, the provider will fall back to the US region.

| Region | Issuer                             |
| ------ | ---------------------------------- |
| US     | https://us.battle.net/oauth        |
| EU     | https://eu.battle.net/oauth        |
| KR     | https://kr.battle.net/oauth        |
| TW     | https://tw.battle.net/oauth        |
| CN     | https://www.battlenet.com.cn/oauth |

## Example

### Minimal configuration

```js
import BattleNetProvider from "next-auth/providers/battlenet";
...
providers: [
  BattleNetProvider({
    clientId: process.env.BATTLENET_CLIENT_ID,
    clientSecret: process.env.BATTLENET_CLIENT_SECRET,
    issuer: process.env.BATTLENET_ISSUER
  })
]
...
```

### Request access to WoW profile

```js
import BattleNetProvider from "next-auth/providers/battlenet";
...
providers: [
  BattleNetProvider({
    clientId: process.env.BATTLENET_CLIENT_ID,
    clientSecret: process.env.BATTLENET_CLIENT_SECRET,
    issuer: process.env.BATTLENET_ISSUER,
    authorization: {
      params: {
        scope: 'openid wow.profile'
      }
    }
  })
]
...
```

:::note
`openid` should be always included in the scope list
:::

### NextAuth configuration to save the access token to the user session

:::tip
The `accessToken` can be used to fetch profile data from a specific Game
:::

```js
...
export default NextAuth({
  providers: [
    BattleNetProvider({
      clientId: process.env.BATTLENET_CLIENT_ID,
      clientSecret: process.env.BATTLENET_CLIENT_SECRET,
      issuer: process.env.BATTLENET_ISSUER,
      authorization: {
        params: {
          scope: 'openid wow.profile'
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 1 * 24 * 60 * 60 // 1 day
  },
  callbacks: {
    async jwt ({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session ({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
})
```
