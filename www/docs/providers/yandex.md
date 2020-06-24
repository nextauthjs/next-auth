---
id: yandex
title: Yandex
---

## Documentation

https://tech.yandex.com/oauth/doc/dg/concepts/about-docpage/

## Configuration

https://oauth.yandex.com/client/new

## Example

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
