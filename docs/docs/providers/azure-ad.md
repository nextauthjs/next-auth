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

- In https://portal.azure.com/ search for "Azure Active Directory", and select your organization.
- Next, go to "App Registration" in the left menu, and create a new one.
- Pay close attention to "Who can use this application or access this API?"
  - This allows you to scope access to specific types of user accounts
  - Only your tenant, all azure tenants, or all azure tenants and public Microsoft accounts (Skype, Xbox, Outlook.com, etc.)
- When asked for a redirection URL, use `https://yourapplication.com/api/auth/callback/azure-ad` or for development `http://localhost:3000/api/auth/callback/azure-ad`.
- After your App Registration is created, under "Client Credential" create your Client secret.
- Now copy your:
  - Application (client) ID
  - Directory (tenant) ID
  - Client secret (value)

In `.env.local` create the following entries:

```
AZURE_AD_CLIENT_ID=<copy Application (client) ID here>
AZURE_AD_CLIENT_SECRET=<copy generated client secret value here>
AZURE_AD_TENANT_ID=<copy the tenant id here>
```

That will default the tenant to use the `common` authorization endpoint. [For more details see here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints).

:::note
Azure AD returns the profile picture in an ArrayBuffer, instead of just a URL to the image, so our provider converts it to a base64 encoded image string and returns that instead. See: https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples. The default image size is 48x48 to avoid [running out of space](https://next-auth.js.org/faq#:~:text=What%20are%20the%20disadvantages%20of%20JSON%20Web%20Tokens%3F) in case the session is saved as a JWT.
:::

In `pages/api/auth/[...nextauth].js` find or add the `AzureAD` entries:

```js
import AzureADProvider from "next-auth/providers/azure-ad";

...
providers: [
  AzureADProvider({
    clientId: process.env.AZURE_AD_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    tenantId: process.env.AZURE_AD_TENANT_ID,
  }),
]
...

```
