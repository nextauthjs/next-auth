---
id: binance
title: Binance
---

## Documentation

https://developers.binance.com/docs/login/web-integration

## Configuration
:::caution
The Binance OAuth 2.0 API is in closed state and you can only obtain credentials by contacting Binance
:::

https://developers.binance.com/en/mpp/



## Options

The **Binance Provider** comes with a set of default options:

- [Binance Provider options](https://github.com/nextauthjs/next-auth/blob/beta/src/providers/binance.js)

You can override any of the options to suit your own use case.

## Example

```js
import BinanceProvider from `next-auth/providers`
...
providers: [
  BinanceProvider({
    clientId: process.env.BINANCE_CLIENT_ID,
    clientSecret: process.env.BINANCE_CLIENT_SECRET
  })
]
...
```
