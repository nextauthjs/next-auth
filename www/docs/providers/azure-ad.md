---
id: azure-ad
title: Azure Active Directory
---

## Documentation

https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Configuration

https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration#redirect-uri-msaljs-20-with-auth-code-flow

## Example
- In https://portal.azure.com/ -> Azure Active Directory create a new App Registration.
- Make sure to remember / copy then application (client) ID
- When asked for a redirection URL, use http://localhost:3000/api/auth/callback/azure-ad

In `.env.local` create the following entries:

```
AZURE_CLIENT_ID=<copy Application (client) ID here> 
```

In `pages/api/auth/[...nextauth].js` find or add the AZURE entries:
  
```js
import Providers from 'next-auth/providers';
...
providers: [
  Providers.AzureAD({
    clientId: process.env.AZURE_CLIENT_ID,
  }),
]
...

```

### Custom scopes

If you want to request custom scopes, pass them to the provider after `openid email profile` like this:

```
Providers.AzureAD({
  clientId: process.env.AZURE_CLIENT_ID,
  scopes: 'openid email profile User.Read`
}),
```

### Using a different port on localhost?

In that case, also specify a `headers` object like this:

```
Providers.AzureAD({
  clientId: process.env.AZURE_CLIENT_ID,
  headers: {
    Origin: 'http://localhost:<your-port>'
  }
}),
```
