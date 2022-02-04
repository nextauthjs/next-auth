---
id: spotify
title: Spotify
---

## Documentation

https://developer.spotify.com/documentation

## Configuration

https://developer.spotify.com/dashboard/applications

## Options

The **Spotify Provider** comes with a set of default options:

- [Spotify Provider options](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/spotify.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Spotify({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  })
]
...
```
