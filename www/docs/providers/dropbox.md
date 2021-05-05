---
id: dropbox
title: Dropbox
---

## Documentation

https://developers.dropbox.com/oauth-guide

## Configuration

https://www.dropbox.com/developers/apps

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Dropbox({
    clientId: process.env.DROPBOX_CLIENT_ID,
    clientSecret: process.env.DROPBOX_CLIENT_SECRET
  })
]
...
```
