---
id: mailchimp
title: Mailchimp
---

## Documentation

https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/

## Configuration

https://admin.mailchimp.com/account/oauth2/client/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Mailchimp({
    clientId: process.env.MAILCHIMP_CLIENT_ID,
    clientSecret: process.env.MAILCHIMP_CLIENT_SECRET
  })
]
...
```
