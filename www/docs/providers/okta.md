---
id: okta
title: Okta
---

## Documentation

https://developer.okta.com/docs/reference/api/oidc

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
}
...
```