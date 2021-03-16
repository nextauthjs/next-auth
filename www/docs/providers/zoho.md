---
id: zoho
title: Zoho
---

## Documentation

https://www.zoho.com/accounts/protocol/oauth/web-server-applications.html

## Configuration

https://api-console.zoho.com/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Zoho({
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET
  })
]
...
```
