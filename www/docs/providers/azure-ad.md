---
id: azure-ad
title: Azure Active Directory
---

## Documentation

https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Configuration

https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app

## Example

### To allow specific Active Directory users access:
- In https://portal.azure.com/ -> Azure Active Directory create a new App Registration.
- Pay close attention to "Who can use this application or access this API?"
  - This allows you to scope access to specific types of user accounts.
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
**Note**: Omit the `AZURE_TENANT_ID` if you created the App Registration for:
> Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)

That will default the tenant to use the `common` authorization endpoint. [For more details see here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints).

In `pages/api/auth/[...nextauth].js` find or add the `AzureAD` entries:
  
```js
import Providers from 'next-auth/providers';
...
providers: [
  Providers.AzureAD({
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID, // omit this if it was omitted above.
    scope: 'offline_access User.Read',
  }),
]
...

```
