---
id: netlify
title: Netlify
---

## Documentation

https://www.netlify.com/blog/2016/10/10/integrating-with-netlify-oauth2/

## Configuration

https://github.com/netlify/netlify-oauth-example

## Options

The **Netlify Provider** comes with a set of default options:

- [Netlify Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/netlify.js)

You can override any of the options to suit your own use case.

## Example

```js
import NetlifyProvider from "next-auth/providers/netlify";
...
providers: [
  NetlifyProvider({
    clientId: process.env.NETLIFY_CLIENT_ID,
    clientSecret: process.env.NETLIFY_CLIENT_SECRET
  })
]
...
```
