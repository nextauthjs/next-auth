---
id: azure-ad-b2c
title: Azure Active Directory B2C
---

:::note
Azure AD B2C returns the following fields on `Account`:
- `refresh_token_expires_in` (number)
- `not_before` (number)
- `id_token_expires_in` (number)
- `profile_info` (string).

See their [docs](https://docs.microsoft.com/en-us/azure/active-directory-b2c/access-tokens). Remember to add these fields to your database schema, in case if you are using an [Adapter](/adapters/overview).
:::

## Documentation

https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow

## Configuration

https://docs.microsoft.com/azure/active-directory-b2c/tutorial-create-tenant

## Options

The **Azure Active Directory Provider** comes with a set of default options:

- [Azure Active Directory Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/azure-ad-b2c.ts)

You can override any of the options to suit your own use case.

## Configuration (Basic)

Basic configuration sets up Azure AD B2C to return an ID Token. This should be done as a prerequisite prior to running through the Advanced configuration.

Step 1: Azure AD B2C Tenant
https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant

Step 2: App Registration
https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-applications

Step 3: User Flow
https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows

Note: For the step "User attributes and token claims" you might minimally:

- Collect attribute:
  - Email Address
  - Display Name
  - Given Name
  - Surname
- Return claim:
  - Email Addresses
  - Display Name
  - Given Name
  - Surname
  - Identity Provider
  - Identity Provider Access Token
  - User's Object ID

## Example

In `.env.local` create the following entries:

```
AZURE_AD_B2C_TENANT_NAME=<copy the B2C tenant name here from Step 1>
AZURE_AD_B2C_CLIENT_ID=<copy Application (client) ID here from Step 2>
AZURE_AD_B2C_CLIENT_SECRET=<copy generated secret value here from Step 2>
AZURE_AD_B2C_PRIMARY_USER_FLOW=<copy the name of the signin user flow you created from Step 3>
```

In `pages/api/auth/[...nextauth].js` find or add the AZURE_AD_B2C entries:

```js
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
...
providers: [
  AzureADB2CProvider({
    tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
    primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
    authorization: { params: { scope: "offline_access openid" } },
  }),
]
...
```

## Configuration (Advanced)

Advanced configuration sets up Azure AD B2C to return an Authorization Token. This builds on the steps completed in the Basic configuration above.

Step 4: Add a Web API application
https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-single-page-app-webapi?tabs=app-reg-ga

Note: this is a second app registration (similar to Step 2) but with different setup and configuration.

## Example

Nothing in `.env.local` needs to change here. The only update is in `pages/api/auth/[...nextauth].js` where you will need to add the additional scopes that were created in Step 4 above:

```js
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
...
providers: [
  AzureADB2CProvider({
    tenantId: process.env.AZURE_AD_B2C_TENANT_NAME,
    clientId: process.env.AZURE_AD_B2C_CLIENT_ID,
    clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET,
    primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
    authorization: { params: { scope: `https://${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/api/demo.read https://${process.env.AZURE_AD_B2C_TENANT_NAME}.onmicrosoft.com/api/demo.write offline_access openid` } },
  }),
]
...

```
