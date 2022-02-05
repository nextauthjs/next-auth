<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/main/packages/prisma/logo.svg" />
   <h3 align="center"><b>Prisma Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/prisma-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/prisma-adapter/next" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/prisma-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/prisma-adapter/next" alt="@next-auth/prisma-adapter Version" /></a>
   </p>
</p>

## Overview

This is the Prisma Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the Prisma schema in the docs at [next-auth.js.org/adapters/prisma](https://next-auth.js.org/adapters/prisma).

## Getting Started

1. Install `next-auth` and `@next-auth/prisma-adapter` as well as `prisma` and `@prisma/client`.

```js
npm install next-auth @next-auth/prisma-adapter @prisma/client
npm install --save-dev prisma
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import * as Prisma from "@prisma/client"

const prisma = new Prisma.PrismaClient()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: PrismaAdapter(prisma)
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/main/CONTRIBUTING.md).

## License

ISC
