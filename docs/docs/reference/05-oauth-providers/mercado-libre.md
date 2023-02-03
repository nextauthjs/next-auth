---
id: mercado-libre
title: Mercado Libre
---

:::note
Mercado Libre is currently the only built-in provider using the OAuth 2.0 spec.
:::

## Documentation

https://developers.mercadolibre.com.ar/es_ar/autenticacion-y-autorizacion

## Options

The **Mercado Libre Provider** comes with a set of default options:

- [Mercado Libre Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/mercado-libre.js)

You can override any of the options to suit your own use case.

## Example

```js
import MercadoLibreProvider from "next-auth/providers/mercado-libre";
...
providers: [
  MercadoLibreProvider({
    clientId: process.env.MERCADO_LIBRE_APP_ID,
    clientSecret: process.env.MERCADO_LIBRE_SECRET_KEY,
    redirectUri: process.env.MERCADO_LIBRE_REDIRECT_URI
  })
]
...
```