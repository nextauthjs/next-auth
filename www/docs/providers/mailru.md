---
id: mailru
title: Mail.ru
---

## Documentation

https://o2.mail.ru/docs

## Configuration

https://o2.mail.ru/app/

## Options

The **Mail.ru Provider** comes with a set of default options:

- [Mail.ru Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/mailru.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.MailRu({
    clientId: process.env.MAILRU_CLIENT_ID,
    clientSecret: process.env.MAILRU_CLIENT_SECRET
  })
]
...
```
