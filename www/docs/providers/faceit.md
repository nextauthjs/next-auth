---
id: faceit
title: FACEIT
---

## Documentation

https://cdn.faceit.com/third_party/docs/FACEIT_Connect_3.0.pdf

## Configuration

https://developers.faceit.com/apps

Grant type: `Authorization Code`

Scopes to have basic infos (email, nickname, guid and avatar) : `openid`, `email`, `profile`

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.FACEIT({
    clientId: process.env.FACEIT_CLIENT_ID,
    clientSecret: process.env.FACEIT_CLIENT_SECRET
  })
]
...
```
