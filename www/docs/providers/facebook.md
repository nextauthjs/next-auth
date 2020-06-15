---
id: facebook
title: Facebook
---

## API Documentation

https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

## App Configuration

https://developers.facebook.com/apps/

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Facebook({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET
  })
}
...
```

:::tip
Production applications cannot use localhost URLs to sign in with Facebook. You need to use a dedicated development application in Facebook to use **localhost** callback URLs.
:::