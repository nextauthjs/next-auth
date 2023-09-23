---
id: keycloak
title: Keycloak
---

## Documentation

[Official Keycloak Documentation](https://www.keycloak.org/docs/latest/server_admin/#_oidc_clients)

For more details on creating an openid-connect client in Keycloak with "confidential" as the "Access Type", you can refer to the following resources:
- [Keycloak Confidential Client Documentation](https://wjw465150.gitbooks.io/keycloak-documentation/content/server_admin/topics/clients/oidc/confidential.html)
- [StackOverflow Discussion on Keycloak Client Secrets](https://stackoverflow.com/questions/44752273/do-keycloak-clients-have-a-client-secret/69726692#69726692)

## Configuration

:::tip
Create an openid-connect client in Keycloak with "confidential" as the "Access Type".
:::

## Options

The **Keycloak Provider** comes with a set of default options:

- [Keycloak Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/keycloak.ts)

You can override any of the options to suit your own use case.

## Example

```js
import KeycloakProvider from "next-auth/providers/keycloak";
...
providers: [
  KeycloakProvider({
    clientId: process.env.KEYCLOAK_ID,
    clientSecret: process.env.KEYCLOAK_SECRET,
    issuer: process.env.KEYCLOAK_ISSUER,
  })
]
...
