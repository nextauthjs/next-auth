---
id: kakao
title: Kakao
---

## Documentation

https://developers.kakao.com/product/kakaoLogin

## Configuration

https://developers.kakao.com/docs/latest/en/kakaologin/common

Create a Kakao application at `https://developers.kakao.com/console/app`.

The "Redirect URI" used the Kakao application must include your full domain and end in the callback path. For example;

For production: https://{YOUR_DOMAIN}/api/auth/callback/kakao
For development: http://localhost:3000/api/auth/callback/kakao

## Options

The **Kakao Provider** comes with a set of default options:

- [Kakao Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/kakao.ts)

You can override any of the options to suit your own use case.

## Example

```js
import KakaoProvider from "next-auth/providers/kakao";
...
providers: [
  KakaoProvider({
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET
  })
]
...
```
