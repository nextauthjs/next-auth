---
id: bitly
title: Bit.ly
---

## Documentation

https://dev.bitly.com/docs/getting-started/authentication

## Configuration

https://app.bitly.com/settings/api/


## Options

The **Bit.ly Provider** comes with a set of default options:

- [Bit.ly Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/bitly.ts)

You can override any of the options to suit your own use case.

## Example

```ts
import BitlyProvider from "next-auth/providers/bitly";
...
providers: [
  BitlyProvider({
    clientId: process.env.BITLY_CLIENT_ID,
    clientSecret: process.env.BITLY_CLIENT_SECRET,
  })
]
...
```
