---
id: zoho
title: Zoho
---

## Documentation

https://www.zoho.com/accounts/protocol/oauth/web-server-applications.html

## Configuration

https://api-console.zoho.com/

## Options

The **Zoho Provider** comes with a set of default options:

- [Zoho Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/zoho.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Zoho({
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET
  })
]
...
```
