---
id: discord
title: Discord
---

## Documentation

https://discord.com/developers/docs/topics/oauth2

## Configuration

https://discord.com/developers/applications

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Discord({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET
  })
]
...
```
