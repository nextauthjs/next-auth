---
id: kakao
title: Kakao
---

## Documentation

https://developers.kakao.com/product/kakaoLogin

## Configuration

https://developers.kakao.com/docs/latest/en/kakaologin/common

Kakao provides up to 10 "Redirect URI" ("Authorized Redirect URIs" in Google). And you must include your full domain and end in the callback path and You can set the URI by selecting "Kakao Login" in "Product Settings".For example;

For production: https://{YOUR_DOMAIN}/api/auth/callback/kakao
For development: http://localhost:3000/api/auth/callback/kakao

## Options

The **Kakao Provider** comes with a set of default options:

- [Kakao Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/kakao.ts)

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

## Instructions

### Configuration

Create a provider and a Kakao application at `https://developers.kakao.com/console/app`. In the settings of the app under Kakao Login, activate web app, change consent items and configure callback URL.
