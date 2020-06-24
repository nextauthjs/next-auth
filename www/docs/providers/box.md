---
id: box
title: Box
---

## Documentation

https://developer.box.com/reference/

## Configuration

https://developer.box.com/guides/sso-identities-and-app-users/connect-okta-to-app-users/configure-box/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Box({
    clientId: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET
  })
}
...
```
