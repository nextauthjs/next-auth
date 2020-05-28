---
id: discord
title: Discord
---

## API Documentation

https://discord.com/developers/docs/topics/oauth2

## App Configuration

https://discord.com/developers/applications

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Discord({
    clientId: process.env.DISCORD_ID
  })
}
...
```

:::tip
Doesn't require **clientSecret**.
:::
