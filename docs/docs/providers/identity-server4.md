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

- [IdentityServer4 Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/identity-server4.js)

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

## Demo IdentityServer

The configuration below is for the demo server at https://demo.identityserver.io/

If you want to try it out, you can copy and paste the configuration below.

You can sign in to the demo service with either <b>bob/bob</b> or <b>alice/alice</b>.

```js
import IdentityServer4Provider from `next-auth/providers/identity-server4`
...
providers: [
  IdentityServer4Provider({
    id: "demo-identity-server",
    name: "Demo IdentityServer4",
    authorization: { params: { scope: "openid profile email api offline_access" } },
    issuer:  "https://demo.identityserver.io/",
    clientId: "interactive.confidential",
    clientSecret: "secret",
  })
}
...
```
