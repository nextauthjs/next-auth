---
id: okta
title: Okta
---

## API Documentation

https://developer.okta.com/docs/reference/api/oidc

## App Configuration



## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Okta({
    clientId: process.env.OKTA_CLIENT_ID,
    clientId: process.env.OKTA_CLIENT_SECRET,
    domain: process.env.OKTA_DOMAIN
  })
}
...
```