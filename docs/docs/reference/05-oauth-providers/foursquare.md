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
:::

## Options

The **Foursquare Provider** comes with a set of default options:

- [Foursquare Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/foursquare.js)

You can override any of the options to suit your own use case.

## Example

```js
import FourSquareProvider from "next-auth/providers/foursquare";
...
providers: [
  FourSquareProvider({
    clientId: process.env.FOURSQUARE_CLIENT_ID,
    clientSecret: process.env.FOURSQUARE_CLIENT_SECRET,
    apiVersion: "YYYYMMDD"
  })
]
...
```
