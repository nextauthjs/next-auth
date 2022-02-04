<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/main/packages/mikro-orm/logo.svg" />
   <h3 align="center"><b>Mikro ORM Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/mikro-orm-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/mikro-orm-adapter/next" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/mikro-orm-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/mikro-orm-adapter/next" alt="@next-auth/mikro-orm-adapter Version" /></a>
   </p>
</p>

## Overview

This is the MikroORM Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `next-auth` and `@next-auth/mikro-orm-adapter`

   ```js
   npm install next-auth @next-auth/mikro-orm-adapter@next
   ```

2. Add this adapter to your `pages/api/[...nextauth].ts` next-auth configuration object.

   ```typescript title="pages/api/auth/[...nextauth].ts"
   import NextAuth from "next-auth"
   import { MikroOrmAdapter } from "@next-auth/mikro-orm-adapter"

   // For more information on each option (and a full list of options) go to
   // https://next-auth.js.org/configuration/options
   export default NextAuth({
      // https://next-auth.js.org/configuration/providers
      providers: [],
      // optionally pass extended models as { entities: { } }
      adapter: MikroOrmAdapter({
         dbName: "./db.sqlite",
         type: "sqlite",
         debug: process.env.DEBUG === "true" || process.env.DEBUG?.includes("db"),
         ...
      }),
      ...
   });
   ```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/main/CONTRIBUTING.md).

## License

ISC
