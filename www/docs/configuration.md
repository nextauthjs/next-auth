---
id: configuration
title: Configuration
---
*This documentation is for next-auth@beta and is not complete. It will be updated closer to release.*

Configuration options are passed to NextAuth.js when initalizing it (in your `/pages/api/auth` route).

The only things you will *need* to configure are the following:

- Your site name (e.g. 'http://www.example.com'), which should be set explicitly for security reasons
- A list of authentication services (Twitter, Facebook, Google, etc)
- A database

## Supported options

* `database` - a database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object
* `adapter` - advanced option for custom databases (see [Adapter](/adapters))
* `sessionMaxAge` - Expire sessions after 30 days of being idle (default: `30*24*60*60*1000`)
* `sessionUpdateAge`
* `verificationMaxAge`
* debug  
  * `sessionUpdateAge`: `24*60*60*1000` (Update session expiry only if session was updated more recently than the last 24 hours)
  * `verificationMaxAge`: `24*60*60*1000`, (Expire verification links (for email sign in) after 24 hours)
  * `debug.: `false` (Set to `true` to enable debug messages to be displayed)

## Example Database Configuration

This is an example of how to use an SQLite in memory database, which can be useful for development and testing, and to check everything is working:

1. Install the database driver as a dependancy in the usual way - e.g. `npm install sqlite3`
2. Pass a *TypeORM* configuration object when calling `NextAuth()` in your API route.

e.g.

```js title="/pages/api/auth/[...slug].js"
database:  {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
}
```

:::tip
* You can pass database credentials securely, using environment variables for options.
* See the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for supported options.
:::

## Supported Databases

The following databases are supported by the default adapter:

* cordova
* expo
* mariadb
* mongodb
* mssql
* mysql
* oracle
* postgres
* sqlite
* sqljs
* react-native

Appropriate tables / collections for Users, Sessions (etc) will be created automatically.

You can customize, extend or replace the models by passing additional options to the `Adapters.Default()` function.

If you are using a database that is not supported out of the box, or if you want to use  NextAuth.js with an existing database, or have a more complex setup with accounts and sessions spread across different systems - you can pass your own methods to be called for user and session creation / deletion (etc).

:::caution
**Supported databases and models/schemas subject to change before release**
:::

## Page Customization

 NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Email Verification, callbacks, etc.

The options displayed are generated based on the configuration supplied.

You can create custom authentication pages if you would like to customize the experience. More details on how to accomplish this are coming soon!