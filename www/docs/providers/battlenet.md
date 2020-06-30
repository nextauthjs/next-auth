---
id: battle.net
title: Battle.net
---

## Documentation

https://develop.battle.net/documentation/guides/using-oauth

## Configuration

https://develop.battle.net/access/clients

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
}
...
```
