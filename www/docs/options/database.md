---
id: database
title: Database Configuration
---

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

## Supported Databases

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
`npm i mongo`

#### Example

```js
database: 'mongodb://username:password@127.0.0.1:3306/database_name?synchronize=true'
```

:::warning
The option **?synchronize=true** automatically syncs schema changes to the database.

It is useful to create the tables you need in the database, but should not be enabled in production as may result in data loss if there are changes to the schema or to NextAuth.js
:::


## Unsupported Databases

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
See the [documentation for adapters](/options/adapter) for more information on advanced configuration, including how to use NextAuth.js with any database.
:::

