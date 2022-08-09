---
id: appdirect
title: AppDirect
---

## Documentation

https://help.appdirect.com/develop/useAppDirectAPI.html

## Configuration

https://help.appdirect.com/products/Default.htm#MarketplaceManager/mm-set-integ-api.htm

## Options

The **AppDirect Provider** comes with a set of default options:

- [AppDirect Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/appdirect.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.AppDirect({
    marketplaceUrl: process.env.APPDIRECT_URL
    clientId: process.env.APPDIRECT_CLIENT_ID,
    clientSecret: process.env.APPDIRECT_CLIENT_SECRET
  })
]
...
```