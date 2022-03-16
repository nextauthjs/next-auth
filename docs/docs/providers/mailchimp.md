---
id: mailchimp
title: Mailchimp
---

## Documentation

https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/

## Configuration

https://admin.mailchimp.com/account/oauth2/client/

## Options

The **Mailchimp Provider** comes with a set of default options:

- [Mailchimp Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/mailchimp.js)

You can override any of the options to suit your own use case.

## Example

```js
import MailchimpProvider from "next-auth/providers/mailchimp";
...
providers: [
  MailchimpProvider({
    clientId: process.env.MAILCHIMP_CLIENT_ID,
    clientSecret: process.env.MAILCHIMP_CLIENT_SECRET
  })
]
...
```
