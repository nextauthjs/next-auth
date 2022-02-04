---
id: strava
title: Strava
---

## Documentation

http://developers.strava.com/docs/reference/

## Options

The **Strava Provider** comes with a set of default options:

- [Strava Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/strava.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from 'next-auth/providers'
...
providers: [
  Providers.Strava({
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
  })
]
...
```
