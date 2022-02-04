---
id: osu
title: Osu!
---

## Documentation

https://osu.ppy.sh/docs/index.html#authentication

## Configuration

https://osu.ppy.sh/home/account/edit#new-oauth-application

## Options

The **Osu Provider** comes with a set of default options:

- [Osu Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/osu.ts)

You can override any of the options to suit your own use case.


:::note
Osu! does **not** provide a user email!
:::


## Example

```js
import OsuProvider from "next-auth/providers/osu";
...
providers: [
  OsuProvider({
    clientId: process.env.OSU_CLIENT_ID,
    clientSecret: process.env.OSU_CLIENT_SECRET
  })
]
...
```
