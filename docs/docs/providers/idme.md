---
id: idme
title: ID.me
---

## Documentation

https://developers.id.me/documentation

## Configuration

https://developers.id.me/organizations

## Options

The **ID.me Provider** comes with a set of default options:

- [ID.me Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/idme.ts)

You can override any of the options to suit your own use case.

## Example

```js
import IDMeProvider from "next-auth/providers/idme";
...
providers: [
  IDMeProvider({
    clientId: process.env.IDME_ID,
    clientSecret: process.env.IDME_SECRET,
    authorization: {
      params: {
        scope: 'openid military teacher',
      }
    }
  })
]
...
```

:::warning
The scope and redirect_uri fields are mandatory. Without them the authentication flow will fail. Do not forget to include openid as part of the scope.
:::

:::tip
ID.me uses scope to verify group affiliation. You can verify groups such as teacher, military, first responder, etc.
:::
