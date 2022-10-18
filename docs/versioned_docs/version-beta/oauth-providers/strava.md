---
id: strava
title: Strava
---

## Documentation

http://developers.strava.com/docs/reference/

## Options

The **Strava Provider** comes with a set of default options:

- [Strava Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/strava.js)

You can override any of the options to suit your own use case.

## Example

```js
import StravaProvider from "next-auth/providers/strava";
...
providers: [
  StravaProvider({
    clientId: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
  })
]
...
```
