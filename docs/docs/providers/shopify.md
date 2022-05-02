---
id: shopify
title: Shopify
---

## Documentation

https://shopify.dev/apps/auth/oauth/getting-started

## Configuration

Add `/api/auth/callback/shopify` in your app settings as the **callback URL**. For instance, if you're trying the sign in locally it'll be: `http://localhost:3000/api/auth/callback`.

:::tip
This guide doesn't apply if you created a custom app in the Shopify admin. Refer to [Access tokens for custom apps in the Shopify admin](https://shopify.dev/apps/auth/admin-app-access-tokens).

If you're building an embedded app, then refer to our tutorial on [authenticating an embedded app using OAuth and session tokens](https://shopify.dev/apps/auth/oauth/session-tokens/getting-started).
:::

## Options

The **Shopify Provider** comes with a set of default options:

- [Shopify Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/shopify.js)

You can override any of the options to suit your own use case.

## Example

```js
File: [...nextauth].ts

import ShopifyProvider from "next-auth/providers/shopify";
...
export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    providers: [
      ...providers,
      ShopifyProvider({
        clientId: process.env.SHOPIFY_ID,
        clientSecret: process.env.SHOPIFY_SECRET,
        shop: req.query.shop,
        authorization: {
          params: { scope: "read_orders write_orders" },
        },
        apiVersion: "2022-01",
      }),
    ],
  })
}
...

File: signIn.ts
// To Sign In a shopify app
import { signIn } from "next-auth/react"

export default function Page() {
  const handlerSignIn = async () => {
    signIn("shopify", null, {
      shop: "hello-world",
    })
  }
  return (
    <button onClick={handlerSignIn}>Shopify Login</button>
  )
}
```
