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

- [Box Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/box.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Box({
    clientId: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
  })
]
...
```
