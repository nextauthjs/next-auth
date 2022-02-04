---
id: pipedrive
title: Pipedrive
---

## Documentation

https://pipedrive.readme.io/docs/marketplace-oauth-authorization

## Options

The **Pipedrive Provider** comes with a set of default options:

- [Pipedrive Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/pipedrive.ts)

You can override any of the options to suit your own use case.

## Example

```js
import PipedriveProvider from "next-auth/providers/pipedrive";
...
providers: [
  PipedriveProvider({
    clientId: process.env.PIPEDRIVE_CLIENT_ID,
    clientSecret: process.env.PIPEDRIVE_CLIENT_SECRET,
  })
]
...
```