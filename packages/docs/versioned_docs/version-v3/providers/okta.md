---
id: okta
title: Okta
---

## Documentation

https://developer.okta.com/docs/reference/api/oidc

## Options

The **Okta Provider** comes with a set of default options:

- [Okta Provider options](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/okta.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Okta({
    clientId: process.env.OKTA_CLIENT_ID,
    clientSecret: process.env.OKTA_CLIENT_SECRET,
    domain: process.env.OKTA_DOMAIN
  })
]
...
```
