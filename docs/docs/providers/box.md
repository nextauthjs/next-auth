---
id: box
title: Box
---

## Documentation

https://developer.box.com/reference/

## Configuration

https://developer.box.com/guides/sso-identities-and-app-users/connect-okta-to-app-users/configure-box/

## Options

The **Box Provider** comes with a set of default options:

- [Box Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/box.js)

You can override any of the options to suit your own use case.

## Example

```js
import BoxProvider from "next-auth/providers/box";
...
providers: [
  BoxProvider({
    clientId: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
  })
]
...
```
