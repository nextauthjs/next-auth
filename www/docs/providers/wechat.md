---
id: wechat
title: WeChat
---

## Documentation

https://developers.weixin.qq.com/doc/offiaccount/en/OA_Web_Apps/Wechat_webpage_authorization.html

## Options

The **WeChat Provider** comes with a set of default options:

- [WeChat Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/wechat.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.WeChat({
    clientId: process.env.WECHAT_APP_ID,
    clientSecret: process.env.WECHAT_APP_SECRET
  })
]
...
```
