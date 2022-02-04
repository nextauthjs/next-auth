---
id: vk
title: VK
---

## Documentation

https://vk.com/dev/first_guide

## Configuration

https://vk.com/apps?act=manage

## Options

The **VK Provider** comes with a set of default options:

- [VK Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/vk.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.VK({
    clientId: process.env.VK_CLIENT_ID,
    clientSecret: process.env.VK_CLIENT_SECRET
  })
]
...
```

:::note
By default the provider uses `5.126` version of the API. See https://vk.com/dev/versions for more info.
:::

If you want to use a different version, you can pass it to provider's options object:

```js
// pages/api/auth/[...nextauth].js

const apiVersion = "5.126"
...
providers: [
  Providers.VK({
    accessTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
    requestTokenUrl: `https://oauth.vk.com/access_token?v=${apiVersion}`,
    authorizationUrl:
      `https://oauth.vk.com/authorize?response_type=code&v=${apiVersion}`,
    profileUrl: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
  })
]
...
```
