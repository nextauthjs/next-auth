---
id: okta
title: Okta
---

## Documentation

https://developer.okta.com/docs/reference/api/oidc

## Options

The **Okta Provider** comes with a set of default options:

- [Okta Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/okta.ts)

You can override any of the options to suit your own use case.

## Configuration

The "Authorized redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;

- For production: https://{YOUR_DOMAIN}/api/auth/callback/okta
- For development: http://localhost:3000/api/auth/callback/okta

## Example

```js
import OktaProvider from "next-auth/providers/okta";
...
providers: [
  OktaProvider({
    clientId: process.env.OKTA_CLIENT_ID,
    clientSecret: process.env.OKTA_CLIENT_SECRET,
    issuer: process.env.OKTA_ISSUER
  })
]
...
```
