---
id: workos
title: WorkOS
---

## Documentation

https://workos.com/docs/sso/guide

## Options

The **WorkOS Provider** comes with a set of default options:

- [WorkOS Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/workos.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.WorkOS({
    clientId: process.env.WORKOS_ID,
    clientSecret: process.env.WORKOS_SECRET,
    domain: process.env.WORKOS_DOMAIN
  }),
],
...
```
