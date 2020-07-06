---
id: spotify
title: Spotify
---

## Documentation

https://developer.spotify.com/documentation

## Configuration

https://developer.spotify.com/dashboard/applications

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Spotify({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  })
}
...
```
