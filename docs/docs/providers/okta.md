---
id: okta
title: Okta
---

## Documentation

https://developer.okta.com/docs/reference/api/oidc

## Options

The **Okta Provider** comes with a set of default options:

- [Okta Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/okta.ts)

You can override any of the options to suit your own use case.

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
