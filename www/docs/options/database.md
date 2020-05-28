---

id: database
title: Database
---

You can specify database credentials as as a connection string or a [TypeORM configuration](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) object.

*i.e. the following approaches are equivalent:*

```javascript
database: `mysql://username:password@127.0.0.1:3306/database_name?synchronize=true`
```

```javascript
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
See the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for supported options.
:::

## Supported Databases

### SQLite

*SQLite is intended only for development / testing and not for production use.*

Install module:
`npm i sqlite3`

Database URI:
`sqlite://localhost/:memory:?synchronize=true`

### MySQL

Install module:
`npm i mysql`

Database URI:
`mysql://username:password@127.0.0.1:3306/database_name?synchronize=true`

### Postgres

Install module:
`npm i pg`

Database URI:
`postgres://username:password@127.0.0.1:5432/database_name?synchronize=true`

### MongoDB

Install module:
`npm i mongo`

Database URI:
`mongodb://username:password@127.0.0.1:27017/database_name?synchronize=true`

:::tip
When configuring your database you should also install an appropriate **npm module**
:::

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
See the [documentation for adapters](/options/adapters) for more information on advanced configuration, including how to use NextAuth.js with any database.
:::

