---
id: whop
title: Whop
---

## Documentation

http://dev.whop.com

## Configuration

https://dash.whop.com/settings/developer

## Options

The **Whop Provider** comes with a set of default options:

- [Whop Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/whop.ts)

You can override any of the options to suit your own use case.

## Example

```js
import WhopProvider from "next-auth/providers/whop"
...
providers: [
  WhopProvider({
    clientId: process.env.WHOP_CLIENT_ID,
    clientSecret: process.env.WHOP_CLIENT_SECRET
  })
}
...
```
