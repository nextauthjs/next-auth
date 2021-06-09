---
id: fusionauth
title: FusionAuth
---

## Documentation

https://fusionauth.io/docs/v1/tech/oauth/

## Options

The **FusionAuth Provider** comes with a set of default options:

- [FusionAuth Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/fusionauth.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.FusionAuth({
    id: "fusionauth",
    name: "FusionAuth",
    domain:  process.env.FUSIONAUTH_DOMAIN,
    clientId: process.env.FUSIONAUTH_CLIENT_ID,
    clientSecret: process.env.FUSIONAUTH_SECRET,
    tenantId: process.env.FUSIONAUTH_TENANT_ID // Only required if you're using multi-tenancy
  }),
]
...
```

:::warning
If you're using multi-tenancy, you need to pass in the `tenantId` option to apply the proper theme.
:::

## Instructions

### Configuration

:::tip
An application can be created at https://your-fusionauth-server-url/admin/application.

For more information, follow the [FusionAuth 5-minute setup guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide).
:::

In the OAuth settings for your application, configure the following.

- Redirect URL
  - https://localhost:3000/api/auth/callback/fusionauth
- Enabled grants
  - Make sure _Authorization Code_ is enabled.
