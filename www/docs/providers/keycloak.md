---
id: keycloak
title: Keycloak
---

## Documentation

https://www.keycloak.org/docs/latest/server_admin/#_oidc_clients

## Configuration

:::tip
Create an openid-connect client in Keycloak with "confidential" as the "Access Type".
:::

## Options

The **Keycloak Provider** comes with a set of default options:

- [Keycloak Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/keycloak.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Keycloak({
    clientId: process.env.KEYCLOAK_ID,
    clientSecret: process.env.KEYCLOAK_SECRET,
    issuer: process.env.KEYCLOAK_ISSUER,
  })
]
...
```

:::note
`issuer` should include the realm – e.g. `https://my-keycloak-domain.com/auth/realms/My_Realm`
:::
