---
id: facebook
title: Facebook
---

## Documentation

https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

## Configuration

https://developers.facebook.com/apps/

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