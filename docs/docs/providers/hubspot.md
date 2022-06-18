---
id: hubspot
title: HubSpot
---

:::note
HubSpot returns a limited amount of information on the token holder (see [docs](https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information)). One other issue is that the name and profile photo cannot be fetched through API as discussed [here](https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521).
:::

## Documentation

https://developers.hubspot.com/docs/api/oauth-quickstart-guide

## Configuration

You need to have an APP in your Developer Account as described at https://developers.hubspot.com/docs/api/developer-tools-overview

## Options

The **HubSpot Provider** comes with a set of default options:

- [HubSpot Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/hubspot.ts)

You can override any of the options to suit your own use case.

## Example

```js
import HubspotProvider from "next-auth/providers/hubspot";
...
providers: [
  HubspotProvider({
    clientId: process.env.HUBSPOT_CLIENT_ID,
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET,
    redirectURL: process.env.HUBSPOT_REDIRECT_URL
  })
]
...
```

:::warning
Only allows one callback URL per Client ID / Client Secret and the redirect URL must be the same as the one on the HubSpot APP Settings page.
:::

