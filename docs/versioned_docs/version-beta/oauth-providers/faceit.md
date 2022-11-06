---
id: faceit
title: FACEIT
---

## Documentation

https://cdn.faceit.com/third_party/docs/FACEIT_Connect_3.0.pdf

## Configuration

https://developers.faceit.com/apps

Grant type: `Authorization Code`

Scopes to have basic infos (email, nickname, guid and avatar) : `openid`, `email`, `profile`

## Options

The **FACEIT Provider** comes with a set of default options:

- [FACEIT Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/faceit.js)

You can override any of the options to suit your own use case.

## Example

```js
import FaceItProvider from "next-auth/providers/faceit";
...
providers: [
  FaceItProvider({
    clientId: process.env.FACEIT_CLIENT_ID,
    clientSecret: process.env.FACEIT_CLIENT_SECRET
  })
]
...
```
