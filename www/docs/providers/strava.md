---
id: strava
title: Strava
---

## Documentation

http://developers.strava.com/docs/reference/

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
