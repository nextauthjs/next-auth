## Overview

This is the Postgres Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the SQL schema in the docs at https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-postgres/example-schema.sql

If you find any bugs please report them - this adapter is new!

## Getting Started

1. Install `next-auth` and `@next-auth/postgres-adapter`. You'll also need the Postgres package `pg`
itself, though you'll likely have this already,

```js
npm install next-auth @next-auth/postgres-adapter
npm install pg
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { PostgresAdapter } from "@next-auth/postgres-adapter"
import { Pool } from "pg";

const connectionString = "postgresql://localhost/adapter-postgres-test"

const client = new Pool({
  connectionString,
});

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: PostrgesAdapter(client)
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
