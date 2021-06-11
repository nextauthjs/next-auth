---
id: discord
title: Discord
---

## Documentation

https://discord.com/developers/docs/topics/oauth2

## Configuration

https://discord.com/developers/applications

## Options

The **Discord Provider** comes with a set of default options:

- [Discord Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/discord.js)

You can override any of the options to suit your own use case.

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
