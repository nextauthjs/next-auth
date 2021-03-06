---
id: kakao
title: Kakao
---

## Documentation

https://developers.kakao.com/product/kakaoLogin

## Configuration

https://developers.kakao.com/docs/latest/en/kakaologin/common

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Kakao({
    clientId: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET
  })
]
...
```

## Instructions

### Configuration

Create a provider and a Kakao application at `https://developers.kakao.com/console/app`. In the settings of the app under Kakao Login, activate web app, change consent items and configure callback URL.
