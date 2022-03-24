---
id: Forge
title: Forge
---

## Warning - Experimental/Alpha

## Documentation

https://forge.autodesk.com/en/docs/oauth/v1/developers_guide/

## Configuration

https://forge.autodesk.com/myapps/

## Example

```js
import ForgeProvider from "next-auth/providers/forge";
...
providers: [
  ForgeProvider({
    clientId: process.env.FORGE_CLIENT_ID,
    clientSecret: process.env.FORGE_CLIENT_SECRET
  })
]
...
```

Define authorization scopes https://forge.autodesk.com/en/docs/oauth/v1/developers_guide/scopes

```js
const options = {
  ...
  providers: [
    ForgeProvider({
      clientId: process.env.FORGE_CLIENT_ID,
      clientSecret: process.env.FORGE_CLIENT_SECRET
      authorization: {
        params: {
          scope: "data:read data:write" 
        }
      }
    })
  ],
  ...
}
```

:::

:::tip
Forge also returns a `email_verified` boolean property in the OAuth profile.

You can use this property to restrict access to people with verified accounts at a particular domain.

```js
const options = {
  ...
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "forge") {
        const forgeProfile = profile as ForgeProfile;
        return forgeProfile.emailVerified && forgeProfile.emailId.endsWith("@example.com");
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
  }
  ...
}
```

:::
