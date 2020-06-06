---
id: Twitch
title: Twitch
---

## API Documentation

https://dev.twitch.tv/docs/authentication

## App Configuration

https://dev.twitch.tv/console/apps

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Twitch({
    clientId: process.env.TWITCH_CLIENT_ID,
    clientId: process.env.TWITCH_CLIENT_SECRET
  })
}
...
```