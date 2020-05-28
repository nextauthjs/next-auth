---
id: auth0
title: Auth0
---

## API Documentation

https://auth0.com/docs/api/authentication#authorize-application

## App Configuration

https://manage.auth0.com/dashboard

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Auth0({
    clientId: process.env.AUTH0_ID,
    accessTokenUrl: process.env.AUTH0_ACCESS_TOKEN_URL,
    authorizationUrl: process.env.AUTH0_AUTHORIZATION_URL,
    profileUrl: process.env.AUTH0_PROFILE_URL
  })
}
...
```

:::tip
Requires **accessTokenUrl**, **authorizationUrl** and **profileUrl**, doesn't require **clientSecret**.
:::
