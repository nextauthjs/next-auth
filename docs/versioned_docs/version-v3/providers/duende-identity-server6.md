---
id: duende-identityserver6
title: DuendeIdentityServer6
---

## Documentation

https://duende-identityserver6.readthedocs.io/en/latest/

## Options

The **DuendeIdentityServer6 Provider** comes with a set of default options:

- [DuendeIdentityServer6 Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/duende-identity-server6.ts)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.DuendeIdentityServer6({
    id: "duende-identity-server6",
    name: "DuendeIdentityServer6",
    scope: "openid profile email api offline_access", // Allowed Scopes
    domain:  process.env.IdentityServer4_Domain,
    clientId: process.env.IdentityServer4_CLIENT_ID,
    clientSecret: process.env.IdentityServer4_CLIENT_SECRET
  })
]
...
```

## Demo IdentityServer

The configuration below is for the demo server at https://demo.duendesoftware.com/

If you want to try it out, you can copy and paste the configuration below.

You can sign in to the demo service with either <b>bob/bob</b> or <b>alice/alice</b>.

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.DuendeIdentityServer6({
    id: "demo-identity-server",
    name: "Demo IdentityServer6",
    scope: "openid profile email api offline_access",
    domain:  "demo.duendesoftware.com/",
    clientId: "interactive.confidential",
    clientSecret: "secret",
    protection: "pkce"
  })
]
...
```
