<p align="center">
   <br/>
    <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" />&nbsp;&nbsp;&nbsp;&nbsp;</a><img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/canary/packages/typeorm-legacy/logo.png" />
   <h3 align="center"><b>TypeORM (Legacy) Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="Canary CI Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/typeorm-legacy-adapter/canary" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/typeorm-legacy-adapter" alt="@next-auth/typeorm-legacy-adapter Version" />
   </p>
</p>

## Overview

This is the TypeORM Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find more TypeORM information in the docs at [next-auth.js.org/adapters/typeorm](https://next-auth.js.org/adapters/typeorm).

## Getting Started

1. Install `typeorm`, `next-auth` and `@next-auth/typeorm-legacy-adapter`

```js
npm install next-auth @next-auth/typeorm-legacy-adapter@next typeorm
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: TypeORMLegacyAdapter({
    type: 'sqlite',  // or mysql, postgresql, mssql
    database: ':memory:',
    synchronize: true
  }),
  ...
})
```

> The `synchronize` option in TypeORM will generate SQL that exactly matches the documented schemas for MySQL and Postgres.
>
> However, it should not be enabled against production databases as it may cause data loss if the configured schema does not match the expected schema!

## Options

This adapter supports MySQL, PostgreSQL, SQLite, as well as MSSQL. Further configuration options are listed below.

> If you're looking for MongoDB support, it's been pulled out into its own adapter [@next-auth/mongodb-adapter](https://next-auth.js.org/adapters/mongodb).

### SQLite

With sqlite, you have the option of using a file on disk as the database, or using a temporary in-memory database. In the `database` field you can either pass in a valid file path to the on-disk database you want to use, or simply write `:memory:` for an in-memory database which will disappear whenever you restart the process.

### MySQL

For MySQL, simply pass a valid connection string to the `database` option, such as `mysql://nextauth:password@127.0.0.1:3306/nextauth?synchronise=true`, and do not forget to set the `type` value to `mysql`.

Schema: [mysql/schema.sql](https://github.com/nextauthjs/adapters/tree/canary/packages/typeorm-legacy/tests/mysql/schema.sql)

### PostgreSQL

For PostgreSQL, you also only need to pass a valid connection string to the `database` option, such as `postgres://nextauth:password@127.0.0.1:5432/nextauth`, and do not forget to set the `type` value to `postgres`.

Schema: [postgresql/schema.sql](https://github.com/nextauthjs/adapters/tree/canary/packages/typeorm-legacy/tests/postgresql/schema.sql)

### Microsoft SQL Server

For MsSQL, pass a valid connection string to the `database` option, such as `mssql://nextauth:password@127.0.0.1:1433/nextauth`, and do not forget to set the `type` value to `mssql`.

Schema: [mssql/schema.sql](https://github.com/nextauthjs/adapters/tree/canary/packages/typeorm-legacy/tests/mssql/schema.sql)

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/canary/CONTRIBUTING.md).

## License

ISC
