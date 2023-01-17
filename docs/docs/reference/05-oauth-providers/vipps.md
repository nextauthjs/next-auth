---
id: vipps
title: Vipps
---

## Documentation

https://vippsas.github.io/vipps-developer-docs/docs/APIs/login-api

## Configuration

https://portal.vipps.no/

## Options

The **Vipps Provider** comes with a set of default options:

- [Vipps Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/vipps.ts)

You can override any of the options to suit your own use case.

## Example

```js
import VippsProvider from "next-auth/providers/vipps"
...
providers: [
  VippsProvider({
    clientId: environment.VIPPS_CLIENT_ID,
    clientSecret: environment.VIPPS_CLIENT_SECRET,
    issuer: environment.VIPPS_ISSUER
  })
]
...
```
