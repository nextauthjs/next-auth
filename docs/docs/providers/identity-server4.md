---
id: identity-server4
title: IdentityServer4
---

:::warning
[IdentityServer4 is discontinued](https://identityserver4.readthedocs.io/en/latest/#:~:text=until%20November%202022.) and only releases security updates until November 2022. You should consider an alternative provider.
:::

## Documentation

https://identityserver4.readthedocs.io/en/latest/

## Options

The **IdentityServer4 Provider** comes with a set of default options:

- [IdentityServer4 Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/identity-server4.js)

You can override any of the options to suit your own use case.

## Example

```js
import IdentityServer4Provider from "next-auth/providers/identity-server4";
...
providers: [
  IdentityServer4Provider({
    id: "identity-server4",
    name: "IdentityServer4",
    issuer:  process.env.IdentityServer4_Issuer,
    clientId: process.env.IdentityServer4_CLIENT_ID,
    clientSecret: process.env.IdentityServer4_CLIENT_SECRET
  })
]
...
```
