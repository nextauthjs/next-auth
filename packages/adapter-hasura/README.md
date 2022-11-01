<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/adapter-hasura/logo.svg" />
   <h3 align="center"><b>Hasura Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/hasura-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/hasura-adapter/next" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/hasura-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/hasura-adapter/next" alt="@next-auth/hasura-adapter Version" /></a>
   </p>
</p>

## Overview

This is the Hasura Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the Hasura schema in the docs at [next-auth.js.org/adapters/hasura](https://next-auth.js.org/adapters/hasura).

## Getting Started

1. Install `next-auth` and `@next-auth/hasura-adapter` as well as `graphql` and `graphql-request`.

```bash
npm install next-auth @next-auth/hasura-adapter graphql graphql-request
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { HasuraAdapter } from "@next-auth/hasura-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default nextAuth({
  adapter: HasuraAdapter({
    endpoint: "<Hasura-GraphQL-endpoint>",
    adminSecret: "<admin-secret>",
    graphqlRequestOptions: {
      // Optional graphql-request options
    },
  }),
  ...
})
```

## Passing dynamic headers

If you use [graphql-request's dynamic headers feature](https://github.com/prisma-labs/graphql-request#passing-dynamic-headers-to-the-client), you are responsible for passing the 'X-Hasura-Admin-Secret' header

```js
export default nextAuth({
  adapter: HasuraAdapter({
    endpoint: "<Hasura-GraphQL-endpoint>",
    adminSecret: "<admin-secret>",
    graphqlRequestOptions: {
      headers: () => ({
        "X-Hasura-Admin-Secret": "<admin-secret>",
        // your headers here
      }),
    },
  }),
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## Credit

Based on code from [Amruth Pillai](https://github.com/AmruthPillai)

## License

ISC
