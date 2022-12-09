---
id: beyondidentity
title: Beyond Identity
---

## Documentation

https://developer.beyondidentity.com/

## Options

The **Beyond Identity Provider** comes with a set of default options:

- [Beyond Identity Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/beyondidentity.ts)

You can override any of the options to suit your own use case.

## Example

```js
import BeyondIdentityProvider from "next-auth/providers/beyondidentity";
...
providers: [
  BeyondIdentityProvider({
    clientId: process.env.BEYOND_IDENTITY_CLIENT_ID,
    clientSecret: process.env.BEYOND_IDENTITY_CLIENT_SECRET,
    issuer: process.env.BEYOND_IDENTITY_ISSUER
  })
]
...
```
