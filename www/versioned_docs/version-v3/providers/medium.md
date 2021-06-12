---
id: medium
title: Medium
---

## Documentation

https://github.com/Medium/medium-api-docs

## Configuration

https://medium.com/me/applications

## Options

The **Medium Provider** comes with a set of default options:

- [Medium Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/medium.js)

You can override any of the options to suit your own use case.

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
