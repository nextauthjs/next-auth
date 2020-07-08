---
id: google
title: Google
---

## Documentation

https://developers.google.com/identity/protocols/oauth2

## Configuration

https://console.developers.google.com/apis/credentials

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
]
...
```
## Notes

Unlike most other providers, Google only Provide the Refresh Token on first sign in.