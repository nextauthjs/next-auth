---
id: microsoft
title: Microsoft
---

## Documentation

https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Configuration

https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant

## Example

```js
import Providers from 'next-auth/providers';
...
providers: [
  Providers.Microsoft({
    clientId: process.env.MS_CLIENT_ID,
    clientSecret: process.env.MS_CLIENT_SECRET,
    scope: 'offline_access openid',
    tenantId: process.env.MS_TENANT_ID,
  }),
]
...
```
