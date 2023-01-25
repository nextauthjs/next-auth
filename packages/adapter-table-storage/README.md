<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="./logo.svg" />
   <h3 align="center"><b>Azure Table Storage Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/table-storage-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/table-storage-adapter" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/table-storage-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/table-storage-adapter" alt="@next-auth/table-storage-adapter Version" /></a>
   </p>
</p>

## Overview

This is the Azure Table Storage Adapter for [`auth.js`](https://authjs.dev). This package can only be used in conjunction with the primary `auth.js` package. It is not a standalone package.

## Getting Started

1. Install `@azure/data-tables`, `next-auth` and `@next-auth/table-storage-adapter`

```js
npm install @azure/data-tables next-auth @next-auth/table-storage-adapter@next
```

2. Create a table for authentication data, `auth` in the example below.

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { TableStorageAdapter } from "@next-auth/table-storage-adapter"
import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables"

const credential = new AzureNamedKeyCredential(
  process.env.AZURE_ACCOUNT,
  process.env.AZURE_ACCESS_KEY
)
const authClient = new TableClient(
  process.env.AZURE_TABLES_ENDPOINT,
  "auth",
  credential
)

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/configuration/auth-options
export default NextAuth({
  // https://authjs.dev/reference/providers/oauth-builtin
  providers: [
    // ...
  ],
  adapter: TableStorageAdapter(authClient),
  // ...
})
```

Environment variable are as follows:

```
AZURE_ACCOUNT=storageaccountname
AZURE_ACCESS_KEY=longRandomKey
AZURE_TABLES_ENDPOINT=https://$AZURE_ACCOUNT.table.core.windows.net
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

## License

ISC
