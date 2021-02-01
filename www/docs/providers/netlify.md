---
id: netlify
title: Netlify
---

## Documentation

https://www.netlify.com/blog/2016/10/10/integrating-with-netlify-oauth2/

## Configuration

https://github.com/netlify/netlify-oauth-example

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Netlify({
    clientId: process.env.NETLIFY_CLIENT_ID,
    clientSecret: process.env.NETLIFY_CLIENT_SECRET
  })
]
...
```
