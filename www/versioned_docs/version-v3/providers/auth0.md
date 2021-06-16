---
id: auth0
title: Auth0
---

## Documentation

https://auth0.com/docs/api/authentication#authorize-application

## Configuration

https://manage.auth0.com/dashboard

:::tip
Configure your application in Auth0 as a 'Regular Web Application' (not a 'Single Page App').
:::

## Options

The **Auth0 Provider** comes with a set of default options:

- [Auth0 Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/auth0.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Auth0({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    domain: process.env.AUTH0_DOMAIN
  })
]
...
```

:::note
`domain` should be the fully qualified domain – e.g. `dev-s6clz2lv.eu.auth0.com`
:::
