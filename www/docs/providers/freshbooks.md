---
id: freshbooks
title: Freshbooks
---

## Documentation

https://www.freshbooks.com/api/authenticating-with-oauth-2-0-on-the-new-freshbooks-api

## Configuration

https://my.freshbooks.com/#/developer

## Options

The Freshbooks Provider comes with a set of default options:

https://www.freshbooks.com/api/start

You can override any of the options to suit your own use case.
## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Freshbooks({
    clientId: process.env.FRESHBOOKS_CLIENT_ID,
    clientSecret: process.env.FRESHBOOKS_CLIENT_SECRET,
  })
]
...
```
