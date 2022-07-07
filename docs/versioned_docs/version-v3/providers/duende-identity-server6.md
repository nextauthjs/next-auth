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
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

...
providers: [
  DuendeIDS6Provider({
    clientId: process.env.DUENDE_IDS6_ID,
    clientSecret: process.env.DUENDE_IDS6_SECRET,
    issuer: process.env.DUENDE_IDS6_ISSUER,
  })
]
...
```

## Demo IdentityServer

The configuration below is for the demo server at https://demo.duendesoftware.com/

If you want to try it out, you can copy and paste the configuration below.

You can sign in to the demo service with either <b>bob/bob</b> or <b>alice/alice</b>.

```js
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"
...
providers: [
  DuendeIDS6Provider({
    clientId: process.env.DUENDE_IDS6_ID,
    clientSecret: process.env.DUENDE_IDS6_SECRET,
    issuer: "demo.duendesoftware.com",
  })
]
...
```
