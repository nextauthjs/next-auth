---
id: patreon
title: Patreon
---

## Documentation

https://docs.patreon.com/#apiv2-oauth

## Configuration

:::tip
Create a API v2 client on [Patreon Platform](https://www.patreon.com/portal/registration/register-clients)
:::

## Options

The **Patreon Provider** comes with a set of default options:

- [Patreon Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/patreon.ts)

You can override any of the options to suit your own use case.

## Example

```js
import PatreonProvider from "next-auth/providers/patreon";
...
providers: [
    PatreonProvider({
      clientId: process.env.PATREON_ID,
      clientSecret: process.env.PATREON_SECRET,
    }))
]
...
```

:::note
Make sure you use the scopes defined in [ApiV2](https://docs.patreon.com/#scopes)
:::
