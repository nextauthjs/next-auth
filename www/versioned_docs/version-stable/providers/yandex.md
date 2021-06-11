---
id: yandex
title: Yandex
---

## Documentation

https://tech.yandex.com/oauth/doc/dg/concepts/about-docpage/

## Configuration

https://oauth.yandex.com/client/new

## Options

The **Yandex Provider** comes with a set of default options:

- [Yandex Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/yandex.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Yandex({
    clientId: process.env.YANDEX_CLIENT_ID,
    clientSecret: process.env.YANDEX_CLIENT_SECRET
  })
]
...
```
