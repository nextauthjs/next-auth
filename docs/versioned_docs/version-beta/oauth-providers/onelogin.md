---
id: onelogin
title: OneLogin
---

## Documentation

https://developers.onelogin.com/openid-connect

## Configuration

https://developers.onelogin.com/openid-connect/connect-to-onelogin

## Options

The **OneLogin Provider** comes with a set of default options:

- [OneLogin Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/onelogin.js)

You can override any of the options to suit your own use case.

## Example

```js
import OneLoginProvider from "next-auth/providers/onelogin";
...
providers: [
  OneLoginProvider({
    clientId: process.env.ONELOGIN_CLIENT_ID,
    clientSecret: process.env.ONELOGIN_CLIENT_SECRET,
    issuer: process.env.ONELOGIN_ISSUER
  })
]
...
```
