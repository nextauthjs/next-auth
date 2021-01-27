---
id: twitch
title: Twitch
---

## Documentation

https://dev.twitch.tv/docs/authentication

## Configuration

https://dev.twitch.tv/console/apps

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Twitch({
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET
  })
]
...
```