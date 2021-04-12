---
id: warnings
title: Warnings
---

This is a list of warning output from NextAuth.js.

All warnings indicate things which you should take a look at, but do not inhibit normal operation.

---

## Client

#### NEXTAUTH_URL

Environment variable `NEXTAUTH_URL` missing. Please set it in your `.env` file.

---

## Server

These warnings are displayed on the terminal.

#### JWT_AUTO_GENERATED_SIGNING_KEY

To remedy this warning, you can either:

**Option 1**: Pass a pre-regenerated Private Key (and, optionally a Public Key) in the jwt options.
```js title="/pages/api/auth/[...nextauth].js"
jwt: {
  signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,

  // You can also specify a public key for verification if using public/private key (but private only is fine)
  // verificationKey: process.env.JWT_SIGNING_PUBLIC_KEY,

  // If you want to use some key format other than HS512 you can specify custom options to use
  // when verifying (note: verificationOptions should include a value for maxTokenAge as well).
  // verificationOptions = {
  //   maxTokenAge: `${maxAge}s`, // e.g. `${30 * 24 * 60 * 60}s` = 30 days
  //   algorithms: ['HS512']
  // },
}
```

You can use [node-jose-tools](https://www.npmjs.com/package/node-jose-tools) to generate keys on the command line and set them as environment variables, i.e. `jose newkey -s 256 -t oct -a HS512`.

**Option 2**: Specify custom encode/decode functions on the jwt object. This gives you complete control over signing / verification / etc.

#### JWT_AUTO_GENERATED_ENCRYPTION_KEY


#### ASYNC_ISSUER

You chose to fetch the issuer metadata from your provider's .well-known endpoint on each invocation by setting the `issuer` option. This may result in slower execution times, as an async fetch call must be done each time `next-auth` runs. Try providing this information through the `issuerMetadata` option.

:::tip
You can create a script that fetches this data at build-time.
Eg.:
```sh
curl https://your-provider.com/.well-known/openid-configuration > issuer-metadata.json
```
and then:
```js title=[...nextauth].js
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import issuerMetadata from "issuer-metadata.json" // Created at build-time

export default NextAuth({
  ...
  providers: [
    {
      id: "your-provider",
      name: "Your Provider",
      clientId: process.env.CLIENT_ID,
      clientsecret: process.env.CLIENT_SECRET,
      issuerMetadata
    }
  ]
})
```
:::

#### OAUTH_CONFIG_DEPRECATED

The way how the OAuth configuration is provided has changed in `next-auth@4`. This is due to an internal migration of an underlying library to [`openid-client`](https://github.com/panva/node-openid-client).

To migrate your configuration, do the following:

<!-- TODO: Check what other properties are unnecessary -->
1. Remove the following properties: `accessTokenUrl`, `authorizationUrl`, `profileUrl`, `requestTokenUrl`
2. Fill out the `issuerMetadata` property according to the `openid-client` documentation: https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-issuermetadata