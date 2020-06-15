---
id: auth0
title: Auth0
---

## API Documentation

https://auth0.com/docs/api/authentication#authorize-application

## App Configuration

https://manage.auth0.com/dashboard

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Auth0({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    subdomain: process.env.AUTH0_SUBDOMAIN
  })
}
...
```