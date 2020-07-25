---
id: linkedin
title: LinkedIn
---

## Documentation

https://docs.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow

## Configuration

https://www.linkedin.com/developers/apps/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.LinkedIn({
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET
  })
]
...
