---
id: azure-ad
title: Azure Active Directory
---

## Documentation

https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Configuration

https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

## Example
- In https://portal.azure.com/ -> Azure Active Directory create a new App Registration.
- Make sure to remember / copy
  - Application (client) ID
  - Directory (tenant) ID
- When asked for a redirection URL, use http://localhost:3000/api/auth/callback/azure-ad
- Create a new secret and remember / copy its value immediately, it will disappear.

In `.env.local` create the follwing entries:

```
AZURE_AD_CLIENT_ID=<copy Application (client) ID here> 
AZURE_AD_CLIENT_SECRET=<copy generated secret value here>
AZURE_AD_TENANT_ID=<copy the tenant id here>
```

In `pages/api/auth/[...nextauth].js` find or add the AZURE_AD entries:
  
```js
import Providers from 'next-auth/providers';
...
providers: [
  Providers.AzureAD({
    tenantId: process.env.AZURE_AD_TENANT_ID,
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    scope: 'offline_access User.Read',
  }),
]
...

```
