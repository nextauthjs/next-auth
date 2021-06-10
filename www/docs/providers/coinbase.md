---
id: coinbase
title: Coinbase 
---

## Documentation

https://developers.coinbase.com/api/v2      

## Configuration

https://www.coinbase.com/settings/api

## Options

The **Coinbase Provider** comes with a set of default options:

- [Coinbase Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/coinbase.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Coinbase({
    clientId: process.env.COINBASE_CLIENT_ID,
    clientSecret: process.env.COINBASE_CLIENT_SECRET
  })
]
...
```

:::tip
This Provider template has a 2 hour access token to it. A refresh token is also returned.
:::
