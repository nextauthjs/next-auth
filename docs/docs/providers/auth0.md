---
id: auth0
title: Auth0
---

## Documentation

https://auth0.com/docs/api/authentication#authorize-application

## Configuration

https://manage.auth0.com/dashboard

:::tip
Configure your application in Auth0 as a "Regular Web Application" (not a "Single Page App").
:::

## Options

The **Auth0 Provider** comes with a set of default options:

- [Auth0 Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/auth0.ts)

You can override any of the options to suit your own use case.

## Example

```js
import Auth0Provider from "next-auth/providers/auth0";
...
providers: [
  Auth0Provider({
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    issuer: process.env.AUTH0_ISSUER
  })
]
...
```

:::note
`issuer` should be the fully qualified URL – e.g. `https://dev-s6clz2lv.eu.auth0.com`
:::
