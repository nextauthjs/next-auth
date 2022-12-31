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

- [Zoom Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/zoom.ts)

You can override any of the options to suit your own use case.

## Example

```js
import ZoomProvider from "next-auth/providers/zoom"
...
providers: [
  ZoomProvider({
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET
  })
}
...
```
