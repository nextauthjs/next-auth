---
id: spotify
title: Spotify
---

## Documentation

https://developer.spotify.com/documentation/general/guides/authorization-guide

## Configuration

https://developer.spotify.com/dashboard/applications

## Options

The **Spotify Provider** comes with a set of default options:

- [Spotify Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/spotify.ts)

You can override any of the options to suit your own use case.

## Example

```js
import SpotifyProvider from "next-auth/providers/spotify";
...
providers: [
  SpotifyProvider({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  })
]
...
```
