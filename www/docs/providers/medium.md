---
id: medium
title: Medium
---

## Documentation

https://github.com/Medium/medium-api-docs

## Configuration

https://medium.com/me/applications

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Medium({
    clientId: process.env.MEDIUM_CLIENT_ID,
    clientSecret: process.env.MEDIUM_CLIENT_SECRET
  })
}
...
```

:::warning
Email address is not returned by the Medium API.
:::
