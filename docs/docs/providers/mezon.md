---
id: mezon
title: Mezon
---

## Documentation

https://mezon.ai/docs/developer/mezon-topics/oauth2

## Configuration

https://mezon.ai/developers/dashboard

## Options

The **Mezon Provider** comes with a set of default options:

- [Mezon Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/mezon.ts)

You can override any of the options to suit your own use case.

## Example

```js
import MezonProvider from "next-auth/providers/mezon"
...
providers: [
  MezonProvider({
    clientId: process.env.MEZON_CLIENT_ID,
    clientSecret: process.env.MEZON_CLIENT_SECRET
  })
}
...
```
