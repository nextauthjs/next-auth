---
id: shopify
title: Shopify
---

## Documentation for Shopify apps
https://shopify.dev/apps


## Options

The **Shopify Provider** comes with a set of default options:

- [Shopify Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/shopify.js)

You can override any of the options to suit your own use case.

## Example

```js
import ShopifyProvider from "next-auth/providers/shopify";
...
providers: [
  ShopifyProvider({
    clientId: process.env.SHOPIFY_ID,
    clientSecret: process.env.SHOPIFY_SECRET,
    shop: "unique-master", // Don't include .myshopify.com
    scope: "read_products,write_products,read_orders,write_orders",
    apiVersion: "2022-01",
  })
]
...
```

## Instructions

### Configuration

:::tip
Here is the docs for Shopify Oauth https://shopify.dev/apps/auth/oauth/getting-started
:::

:::tip
Create your shopify partner account https://www.shopify.com/shopifypartnersvap and create an app from there

Under "URLs" in the App Setup, configure the following for "OAuth 2.0":

- Redirect URL
  - http://localhost:3000/api/auth/callback/shopify
:::
