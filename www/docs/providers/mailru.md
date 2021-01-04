---
id: Mail.ru
title: Mail.ru
---

## Documentation

https://o2.mail.ru/docs

## Configuration

https://o2.mail.ru/app/

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
