---
id: naver
title: Naver
---

## Documentation

https://developers.naver.com/docs/login/overview/overview.md

## Configuration

https://developers.naver.com/docs/login/api/api.md

## Options

The **Naver Provider** comes with a set of default options:

- [Naver Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/naver.js)

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
