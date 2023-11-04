---
id: pinterest
title: Pinterest
---

## Documentation

https://developers.pinterest.com/docs/getting-started/authentication/

## Configuration

https://developers.pinterest.com/apps/

## Options

The **Pinterest Provider** comes with a set of default options:

- [Pinterest Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/pinterest.ts)

You can override any of the options to suit your own use case.

## Example

```ts
import PinterestProvider from "next-auth/providers/pinterest"
...
providers: [
  PinterestProvider({
    clientId: process.env.PINTEREST_ID,
    clientSecret: process.env.PINTEREST_SECRET
  })
]
...

:::tip
To use in production, make sure the app has standard API access and not trial access
:::
```
