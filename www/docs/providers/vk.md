---
id: vk
title: vk.com
---

## Documentation

https://vk.com/dev/first_guide

## Configuration

https://vk.com/apps?act=manage

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
