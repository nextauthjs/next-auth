---
id: facebook
title: Facebook
---

## API Documentation

https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/

## App Configuration

https://developers.facebook.com/apps/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Facebook({
    clientId: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
  })
}
...
```

:::tip
Production applications cannot use localhost URLs to sign in with Facebook. You need to use a dedicated development application in Facebook to use **localhost** callback URLs.
:::

:::warning
Facebook may not return email address if the account was setup using a mobile number and the user has not provided an email address to Facebook. If this happens the user will not be able to sign in as NextAuth.js requires an email address.
:::
