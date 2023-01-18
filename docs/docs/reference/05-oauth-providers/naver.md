---
id: naver
title: Naver
---

## Documentation

https://developers.naver.com/docs/login/overview/overview.md

## Configuration

https://developers.naver.com/docs/login/api/api.md

Naver provides up to 5 "Callback URLs" ("Authorized Redirect URIs" in Google). And you must include your full domain and end in the callback path. For example;

For production: https://{YOUR_DOMAIN}/api/auth/callback/naver
For development: http://localhost:3000/api/auth/callback/naver

## Options

The **Naver Provider** comes with a set of default options:

- [Naver Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/naver.ts)

You can override any of the options to suit your own use case.

## Example

```js
import NaverProvider from "next-auth/providers/naver";
...
providers: [
  NaverProvider({
    clientId: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET
  })
]
...
```
