---
id: databases
title: Databases
---

NextAuth.js comes with multiple ways of connecting to a database:

* **TypeORM** (default) - MySQL, Postgres, SQLite, MongoDB
* **Prisma** - MySQL, Postgres, SQLite
* **Custom Adapter** - Connect to any database

**This document covers the default adapter (TypeORM).**

See the [documentation for adapters](/schemas/adapters) to learn more about using Prisma adapter or using a custom adapter.

To learn more about databases in NextAuth.js and how they are used, check out [databases in the FAQ](/faq#databases).

---

## How to use a database

You can specify database credentials as as a connection string or a [TypeORM configuration](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) object.

The following approaches are exactly equivalent:

```js
database: 'mysql://username:password@127.0.0.1:3306/database_name'
```

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'nextauth'
}
```

:::tip
You can pass in any valid [TypeORM configuration option](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md).

*e.g. To set a prefix for all table names you can use the **entityPrefix** option as connection string parameter:*

```js
'mysql://username:password@127.0.0.1:3306/database_name?entityPrefix=nextauth_'
```

*…or as a database configuration object:*

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'nextauth'
  entityPrefix: 'nextauth_'
}
```
:::

---

## Setting up a database

Running SQL to create your tables and columns is the recommended way to set up an SQL database.

* [MySQL Schema](/schemas/mysql)
* [Postgres Schema](/schemas/postgres)

_If you are running SQLite, MongoDB or a Document database you can skip this step._

You can also have your tables and schemas created automatically using the `synchronize: true` option:

```js
database: 'mysql://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

```js
database: {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'nextauth',
  password: 'password',
  database: 'nextauth',
  synchronize: true
}
```

:::warning
**The `synchronize` option should not be used against production databases.**

It is useful to create the tables you need in the database when setting one up for the first time, but it should not be enabled against production databases as it may result in data loss if there is a difference between the schema on in the database and the schema that NextAuth.js is expecting.
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
database: 'mysql://username:password@127.0.0.1:3306/database_name'
```

### MariaDB

Install module:
`npm i mariadb`

#### Example

```js
database: 'mariadb://username:password@127.0.0.1:3306/database_name'
```

### Postgres

Install module:
`npm i pg`

#### Example

```js
database: 'postgres://username:password@127.0.0.1:3306/database_name'
```

### MongoDB

Install module:
`npm i mongodb`

#### Example

```js
database: 'mongodb://username:password@127.0.0.1:3306/database_name'
```

### SQLite

*SQLite is intended only for development / testing and not for production use.*

Install module:
`npm i sqlite3`

#### Example

```js
database: 'sqlite://localhost/:memory:'
```

---

## Other databases

See the [documentation for adapters](/schemas/adapters) for more information on advanced configuration, including how to use NextAuth.js with other databases using a [custom adapter](/tutorials/creating-a-database-adapter).
