---
id: zoom
title: Zoom
---

## Documentation

https://marketplace.zoom.us/docs/guides/auth/oauth

## Configuration

https://marketplace.zoom.us

## Options

The **Zoom Provider** comes with a set of default options:

- [Zoom Provider options](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/zoom.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Zoom({
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET
  })
}
...
```
