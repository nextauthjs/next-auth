---
id: authentik
title: Authentik
---

## Documentation

https://goauthentik.io/docs/providers/oauth2

## Options

The **Authentik Provider** comes with a set of default options:

- [Authentik Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/authentik.ts)

You can override any of the options to suit your own use case.

## Example

```js
import AuthentikProvider from "next-auth/providers/authentik";
...
providers: [
  AuthentikProvider({
    clientId: process.env.AUTHENTIK_ID,
    clientSecret: process.env.AUTHENTIK_SECRET,
    issuer: process.env.AUTHENTIK_ISSUER,
  })
]
...
```

:::note
`issuer` should include the slug – e.g. `https://my-authentik-domain.com/application/o/My_Slug/`
:::
