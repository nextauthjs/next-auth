---
id: databases
title: Databases
---

NextAuth.js comes with multiple ways of connecting to a database:

- **TypeORM** (default)<br/>
  _The TypeORM adapter supports MySQL, PostgreSQL, MSSQL, SQLite and MongoDB databases._
- **Prisma**<br/>
  _The Prisma 2 adapter supports MySQL, PostgreSQL and SQLite databases._
- **Fauna**<br/>
  _The FaunaDB adapter only supports FaunaDB._
- **Custom Adapter**<br/>
  _A custom Adapter can be used to connect to any database._

> There are currently efforts in the [`nextauthjs/adapters`](https://github.com/nextauthjs/adapters) repository to get community-based DynamoDB, Sanity, PouchDB and Sequelize Adapters merged. If you are interested in any of the above, feel free to check out the PRs in the `nextauthjs/adapters` repository!

**This document covers the default adapter (TypeORM).**

See the [documentation for adapters](/adapters/overview) to learn more about using Prisma adapter or using a custom adapter.

To learn more about databases in NextAuth.js and how they are used, check out [databases in the FAQ](/faq#databases).

---

## How to use a database

You can specify database credentials as as a connection string or a [TypeORM configuration](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) object.

The following approaches are exactly equivalent:

```js
database: "mysql://nextauth:password@127.0.0.1:3306/database_name"
```

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'database_name'
}
```

:::tip
You can pass in any valid [TypeORM configuration option](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md).

_e.g. To set a prefix for all table names you can use the **entityPrefix** option as connection string parameter:_

```js
"mysql://nextauth:password@127.0.0.1:3306/database_name?entityPrefix=nextauth_"

```

_…or as a database configuration object:_

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'database_name',
  entityPrefix: 'nextauth_'
}
```

:::

---

## Setting up a database

Using SQL to create tables and columns is the recommended way to set up an SQL database for NextAuth.js.

Check out the links below for SQL you can run to set up a database for NextAuth.js.

- [MySQL Schema](/adapters/typeorm/mysql)
- [Postgres Schema](/adapters/typeorm/postgres)

_If you are running SQLite, MongoDB or a Document database you can skip this step._

Alternatively, you can also have your database configured automatically using the `synchronize: true` option:

```js
database: "mysql://nextauth:password@127.0.0.1:3306/database_name?synchronize=true"
```

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'database_name',
  synchronize: true
}
```

:::warning
**The `synchronize` option should not be used against production databases.**

It is useful to create the tables you need when setting up a database for the first time, but it should not be enabled against production databases as it may result in data loss if there is a difference between the schema that found in the database and the schema that the version of NextAuth.js being used is expecting.
:::

---

## Supported databases

The default database adapter is TypeORM, but only some databases supported by TypeORM are supported by NextAuth.js as custom logic needs to be handled by NextAuth.js.

Databases compatible with MySQL, Postgres and MongoDB should work out of the box with NextAuth.js. When used with any other database, NextAuth.js will assume an ANSI SQL compatible database.

:::tip
When configuring your database you also need to install an appropriate **node module** for your database.
:::

### MySQL

Install module:
`npm i mysql`

#### Example

```js
database: "mysql://username:password@127.0.0.1:3306/database_name"
```

### MariaDB

Install module:
`npm i mariadb`

#### Example

```js
database: "mariadb://username:password@127.0.0.1:3306/database_name"
```

### Postgres / CockroachDB

Install module:
`npm i pg`

#### Example

PostgresDB

```js
database: "postgres://username:password@127.0.0.1:5432/database_name"
```

CockroachDB

```js
database: "postgres://username:password@127.0.0.1:26257/database_name"
```

If the node is using Self-signed cert

```js
database: {
    type: "cockroachdb",
    host: process.env.DATABASE_HOST,
    port: 26257,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('/path/to/server-certificates/root.crt').toString()
    },
  },
```

Read more: [https://node-postgres.com/features/ssl](https://node-postgres.com/features/ssl)

---

### Microsoft SQL Server

Install module:
`npm i mssql`

#### Example

```js
database: "mssql://sa:password@localhost:1433/database_name"
```

### MongoDB

Install module:
`npm i mongodb`

#### Example

```js
database: "mongodb://username:password@127.0.0.1:3306/database_name"
```

### SQLite

_SQLite is intended only for development / testing and not for production use._

Install module:
`npm i sqlite3`

#### Example

```js
database: "sqlite://localhost/:memory:"
```

## Other databases

See the [documentation for adapters](/adapters/overview) for more information on advanced configuration, including how to use NextAuth.js with other databases using a [custom adapter](/tutorials/creating-a-database-adapter).
