---
id: tiktok
title: TikTok
---

## Documentation

https://developers.tiktok.com/doc/login-kit-web/

## Configuration

https://developers.tiktok.com/doc/getting-started-create-an-app/

## Options

The **TikTok Provider** comes with a set of default options:

- [TikTok Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/tiktok.js)

You can override any of the options to suit your own use case.

:::note
TikTok requires that a `redirect_uri` param is sent. This must be configured to use the full URL, including protocol, domain, port and path to your Sign In API (default path for Auth.js is `api/auth/signin`). It should look something like `https://mydomain.com/api/auth/signin`.
:::

## Example

```js
import TikTokProvider from "next-auth/providers/tiktok";
...
providers: [
  TikTokProvider({
    clientId: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET
    redirect_uri: "https://mydomain.com/api/auth/signin"
  })
]
...
```
