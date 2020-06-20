---
id: yandex
title: Yandex
---

## API Documentation

https://tech.yandex.com/oauth/doc/dg/concepts/about-docpage/

## App Configuration

https://oauth.yandex.com/client/new

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Yandex({
    clientId: process.env.YANDEX_CLIENT_ID,
    clientSecret: process.env.YANDEX_CLIENT_SECRET
  })
}
...
```
