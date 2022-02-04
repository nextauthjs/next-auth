---
id: twitch
title: Twitch
---

## Documentation

https://dev.twitch.tv/docs/authentication

## Configuration

https://dev.twitch.tv/console/apps

Add the following redirect URL into the console `http://<your-next-app-url>/api/auth/callback/twitch`

## Options

The **Twitch Provider** comes with a set of default options:

- [Twitch Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/twitch.ts)

You can override any of the options to suit your own use case.

## Example

```js
import TwitchProvider from "next-auth/providers/twitch";
...
providers: [
  TwitchProvider({
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET
  })
]
...
```
