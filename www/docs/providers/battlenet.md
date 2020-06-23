---
id: battle.net
title: Battle.net
---

## API Documentation

https://develop.battle.net/documentation/guides/using-oauth

## App Configuration

https://develop.battle.net/access/clients


## Usage

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
