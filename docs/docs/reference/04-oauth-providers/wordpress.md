---
id: wordpress
title: WordPress.com
---

## Documentation

https://developer.wordpress.com/docs/oauth2/

## Configuration

https://developer.wordpress.com/apps/

## Options

The **Wordpress Provider** comes with a set of default options:

- [Wordpress Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/wordpress.js)

You can override any of the options to suit your own use case.

## Example

```js
import WordpressProvider from "next-auth/providers/wordpress";
...
providers: [
  WordpressProvider({
    clientId: process.env.WORDPRESS_CLIENT_ID,
    clientSecret: process.env.WORDPRESS_CLIENT_SECRET
  })
}
...
```

:::tip
Register your application to obtain Client ID and Client Secret at https://developer.wordpress.com/apps/ Select Type as Web and set Redirect URL to `http://example.com/api/auth/callback/wordpress` where example.com is your site domain.
:::
