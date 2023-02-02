---
id: ping-id
title: Ping Identity
---

## Documentation

https://docs.pingidentity.com/r/en-us/pingone/p1_add_app_worker

## Options

The **Ping Identity Provider** comes with a set of default options:

- [Ping Identity Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/ping-id.js)

You can override any of the options to suit your own use case.

## Example

```js
import PingIdProvider from "next-auth/providers/ping-id";
...
providers: [
  PingIdProvider({
    clientId: process.env.PING_CLIENT_ID,
    clientSecret: process.env.PING_CLIENT_SECRET,
    issuer: process.env.PING_ISSUER
  })
]
...
```
