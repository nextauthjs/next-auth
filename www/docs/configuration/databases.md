---
id: databases
title: Databases
---

## About databases in NextAuth.js

### What is a database used for?

Databases in NextAuth.js are used for persisting users, oauth accounts, email sign in tokens and sessions.

Specifying a database is optional if you don't need to persist user data or support email sign in - if you don't specify a database then JSON Web Tokens will be enabled for session storage and used to store session data.

:::note
If you do specify a database then database sessions are be enabled by default, unless you explicitly enable JSON Web Tokens for sessions by passing the option `sessions { jwt: true }`.

If you enable JWT sessions when using a database then accounts will still be persisted in database but stateless sessions will be used on the client. Using JSON Web Tokens in Serverless applications is often less expensive and performs better than database sessions.
:::

### Should I use a database?

* Using NextAuth.js without a database works well for internal tools - where you need to control who is able to sign in, but when you do not need to create user accounts for them in your application.

* Using NextAuth.js with a database is usually a better approach for a consumer facing application where you need to persist accounts (e.g. for billing, to contact customers, etc).

### What database should I use?

Managed database solutions for MySQL, Postgres and MongoDB are well supported from cloud providers such as Amazon, Google, Microsoft and Atlas. If you are deploying directly to a particular cloud platform you may also want to consider serverless database offerings they have (e.g. [Amazon Aurora Serverless on AWS](https://aws.amazon.com/rds/aurora/serverless/)).

## How to specify a database

You can specify database credentials as as a connection string or a [TypeORM configuration](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) object.

The following approaches are exactly equivalent:

```js
database: 'mysql://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

```js
database: {
  type: 'mysql',
  host: "127.0.0.1",
  port: 3306,
  username: "nextauth",
  password: "password",
  database: "nextauth",
  synchronize: true
}
```

:::note
See the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for all the supported database options.
:::

## Setting up a database

NextAuth.js will configure your database with tables / collections automatically if `synchronize: true` is set.

If you are having problems connecting to your database, try enabling debug message with the `debug: true` option when initializing NextAuth.js.

:::warning
The option **?synchronize=true** automatically synchronizes the database schema with what NextAuth.js expects. It is useful to create the tables you need in the database on first run against a test database but it should not be enabled in production as it may result in data loss.
:::

:::tip
If you want to set a prefix for all table names you can use the TypeORM **entityPrefix** option.

*For example:*

```js
'mysql://username:password@127.0.0.1:3306/database_name?entityPrefix=nextauth_'
```

*…or as a database configuration object:*

```js
database: {
  type: 'mysql',
  host: "127.0.0.1",
  port: 3306,
  username: "nextauth",
  password: "password",
  database: "nextauth",
  synchronize: true,
  entityPrefix: 'nextauth_'
}
```

:::

## Supported databases

NextAuth.js uses TypeORM as the default database adapter, but only some databases supported by TypeORM are supported by NextAuth.js (as custom logic for creating indexes and date/time handling is required).

:::tip
When configuring your database you also need to install an appropriate **node module** for your database.
:::

### SQLite

*SQLite is intended only for development / testing and not for production use.*

Install module:
`npm i sqlite3`

#### Example

```js
database: 'sqlite://localhost/:memory:?synchronize=true'
```

### MySQL

Install module:
`npm i mysql`

#### Example

```js
database: 'mysql://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

### MariaDB

Install module:
`npm i mariadb`

#### Example

```js
database: 'mariadb://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

### Postgres

Install module:
`npm i pg`

#### Example

```js
database: 'postgres://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

### MongoDB

Install module:
`npm i mongodb`

#### Example

```js
database: 'mongodb://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

## Using other databases

See the [documentation for adapters](/schemas/adapters) for more information on advanced configuration, including how to use NextAuth.js with other databases using a [custom adapter](/tutorials/creating-a-database-adapter).

