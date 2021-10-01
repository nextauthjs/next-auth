---
id: bitbucket
name: Bitbucket
---

## Documentation

https://developer.atlassian.com/cloud/bitbucket/oauth-2/

## Options

The **Bitbucket Provider** comes with a set of default options:

- [Bitbucket Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/bitbucket.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Bitbucket({
    clientId: process.env.BITBUCKET_CLIENT_ID,
    clientSecret: process.env.BITBUCKET_CLIENT_SECRET
  })
]
...
```

## Instructions

### Configuration

:::tip
You can create a consumer on any existing workspace

For more information, follow the [Use OAuth on Bitbucket Cloud guide](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/)
:::
