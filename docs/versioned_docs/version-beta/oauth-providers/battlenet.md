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

- [Battle.net Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/battlenet.js)

You can override any of the options to suit your own use case.

## Example

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

`issuer` must be one of these values, based on the [available regions](https://develop.battle.net/documentation/guides/regionality-and-apis):

```ts
type BattleNetIssuer =
  | "https://www.battlenet.com.cn/oauth"
  | "https://us.battle.net/oauth"
  | "https://eu.battle.net/oauth"
  | "https://kr.battle.net/oauth"
  | "https://tw.battle.net/oauth"
```
