<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/main/packages/edgedb/logo.svg" />
   <h3 align="center"><b>EdgeDB Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/edgedb-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/edgedb-adapter/next" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/edgedb-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/edgedb-adapter/next" alt="@next-auth/edgedb-adapter Version" /></a>
   </p>
</p>

## Overview

This is the EdgeDB Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the EdgeDB schema in the docs at [next-auth.js.org/adapters/edgedb](https://next-auth.js.org/adapters/edgedb).

## Getting Started

1. Install `next-auth` and `@next-auth/edgedb-adapter` as well as `edgedb` and `@edgedb/generate`.

```js
npm install next-auth edgedb @next-auth/edgedb-adapter
npm install @edgedb/generate --save-dev
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { EdgeDBAdapter } from "@next-auth/edgedb-adapter"
import { createClient } from "edgedb"

const client = createClient()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: EdgeDB(client)
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
