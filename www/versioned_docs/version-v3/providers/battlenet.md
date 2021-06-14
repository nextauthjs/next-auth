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

- [Battle.net Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/battlenet.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.BattleNet({
    clientId: process.env.BATTLENET_CLIENT_ID,
    clientSecret: process.env.BATTLENET_CLIENT_SECRET,
    region: process.env.BATTLENET_REGION
  })
]
...
```
