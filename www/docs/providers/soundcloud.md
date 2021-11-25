---
id: soundcloud
title: SoundCloud
---

## Documentation

https://developers.soundcloud.com/docs/api/guide

## Configuration

https://soundcloud.com/you/apps

## Options

The **SoundCloud Provider** comes with a set of default options:

- [SoundCloud Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/Soundcloud.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.SoundCloud({
    clientId: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET
  })
]
...
```
