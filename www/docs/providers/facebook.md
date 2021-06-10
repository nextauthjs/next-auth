---
id: facebook
title: Facebook
---

## Documentation

https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

## Configuration

https://developers.facebook.com/apps/

## Options

The **Facebook Provider** comes with a set of default options:

- [Facebook Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/facebook.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Facebook({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  })
]
...
```

:::tip
Production applications cannot use localhost URLs to sign in with Facebook. You need to use a dedicated development application in Facebook to use **localhost** callback URLs.
:::

:::tip
Email address may not be returned for accounts created on mobile.
:::
