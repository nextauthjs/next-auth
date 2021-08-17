---
id: trovo
title: Trovo
---

## Documentation

https://developer.trovo.live/docs/APIs.html#_1-introduction

## Configuration

https://developer.trovo.live

## Options

The **Trovo Provider** comes with a set of default options:

- [Spotify Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/trovo.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Trovo({
    clientId: process.env.TROVO_CLIENT_ID,
    clientSecret: process.env.TROVO_CLIENT_SECRET
  })
]
...
```
