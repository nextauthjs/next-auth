---
id: databases
title: Databases
---

Specifying a database is optional if you don't need to persist user data or support email sign in.

If you want to do either of these things you will need to specify a database.

If you don't specify a database then JSON Web Tokens will be enabled and used to store session data. If you do specify a database then database sessions will be enabled, unless you explicitly enable JSON Web Tokens for sessions by passing the option `sessions { jwt: true }`.

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

NextAuth.js uses TypeORM as the default database adapter, but only some databases are supported.

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


## Unsupported databases

The following additional databases are supported by TypeORM (which the default adapter uses) and *may* work with NextAuth.js but have not been tested:

* cordova
* expo
* mssql
* oracle
* sqljs
* react-native

Any database that supports ANSI SQL *should* work out of the box.

:::tip
You can customize, extend or replace the models, you can do this by using the 'adapters' option and passing passing additional options to **Adapters.Default()**. How to do this is not yet documented.
:::

:::note
See the [documentation for adapters](/schemas/adapters) for more information on advanced configuration, including how to use NextAuth.js with any database.
:::

