---
id: orcid
title: Orcid
---

## Documentation

https://info.orcid.org/documentation/api-tutorials/api-tutorial-get-and-authenticated-orcid-id/

## Configuration

https://info.orcid.org/register-a-client-application-production-member-api/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Orchid({
    clientId: process.env.ORCID_ID,
    clientSecret: process.env.ORCID_SECRET
  })
]
...
```
