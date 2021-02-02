---
id: foursquare
title: Foursquare
---

## Documentation

https://developer.foursquare.com/docs/places-api/authentication/#web-applications

## Configuration

https://developer.foursquare.com/

:::warning
Foursquare requires an additional `apiVersion` parameter in [`YYYYMMDD` format](https://developer.foursquare.com/docs/places-api/versioning/), which essentially states "I'm prepared for API changes up to this date".

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Foursquare({
    clientId: process.env.FOURSQUARE_CLIENT_ID,
    clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
    apiVersion: 'YYYYMMDD'
  })
]
...
```
