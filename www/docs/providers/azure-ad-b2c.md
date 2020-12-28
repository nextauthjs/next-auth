---
id: azure-ad-b2c
title: Azure Active Directory B2C
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
  Providers.AzureADB2C({
    clientId: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    scope: 'offline_access User.Read',
    tenantId: process.env.AZURE_TENANT_ID,
  }),
]
...
```
