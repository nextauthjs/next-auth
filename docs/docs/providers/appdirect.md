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
Create an API Client in the target marketplace following the [configuration instructions](https://help.appdirect.com/products/Default.htm#MarketplaceManager/mm-set-integ-api.htm).

Make sure to save your consumer secret after creating your client.
- the AppDirect Consumer Key is your APPDIRECT_CLIENT_ID
- the AppDirect Consumer Secret is your APPDIRECT_CLIENT_SECRET
- the URL of your marketplace is your APPDIRECT_URL. This will default to `https://marketplace.appdirect.com` if not provided.

In .env.local create the following entries:

```
APPDIRECT_CLIENT_ID=abc123
APPDIRECT_CLIENT_SECRET=abc123
APPDIRECT_URL=https://marketplace.example.com
```

In pages/api/auth/[...nextauth].js find or add the APPDIRECT entries:

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