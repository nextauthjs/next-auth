---
id: pipedrive
title: Pipedrive
---

## Documentation

https://pipedrive.readme.io/docs/marketplace-oauth-authorization

## Options

The **Pipedrive Provider** comes with a set of default options:

- [Pipedrive Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/pipedrive.js)

You can override any of the options to suit your own use case.

By default, it should work for both versions: v3 and v4 (current in beta)

## Example

```js
import Providers from 'next-auth/providers'
...
providers: [
  Providers.Pipedrive({
    clientId: process.env.PIPEDRIVE_CLIENT_ID,
    clientSecret: process.env.PIPEDRIVE_CLIENT_SECRET,
    redirectUri: 'http://localhost:3000/api/auth/callback/pipedrive'
  })
]
...
```
