---
id: workos
title: WorkOS
---

## Documentation

https://workos.com/docs/sso/guide

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.WorkOS({
    clientId: process.env.WORKOS_ID,
    clientSecret: process.env.WORKOS_SECRET,
    domain: process.env.WORKOS_DOMAIN
  }),
],
...
```
