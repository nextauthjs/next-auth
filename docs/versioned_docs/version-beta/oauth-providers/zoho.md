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

- [Zoho Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/zoho.js)

You can override any of the options to suit your own use case.

## Example

```js
import ZohoProvider from "next-auth/providers/zoho";
...
providers: [
  ZohoProvider({
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET
  })
]
...
```
