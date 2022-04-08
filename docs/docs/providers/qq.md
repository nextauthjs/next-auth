---
id: qq
title: Tencent QQ
---

## Documentation

https://wiki.connect.qq.com/准备工作_OAuth2.0

## Configuration

https://connect.qq.com/manage.html#/

## Options

The **Tencent QQ Provider** comes with a set of default options:

- [Tencent QQ Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/qq.js)

You can override any of the options to suit your own use case.

## Example

```js
import TencentQQProvider from "next-auth/providers/qq";
...
providers: [
  TencentQQProvider({
    clientId: process.env.TENCENT_ID,
    clientSecret: process.env.TENCENT_APP_KEY,
  }),
]
...
```
