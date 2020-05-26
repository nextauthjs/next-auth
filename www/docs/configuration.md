---
id: configuration
title: Configuration
---
*This documentation is for next-auth@beta and is not complete. It will be updated closer to release.*

Configuration options are passed to NextAuth.js when initalizing it (in your `/pages/api/auth` route).

The only required options to get started are **site**, **providers** and **database**.

## Options

* **site** (REQUIRED)

  The fully qualified URL of your site e.g. `http://localhost:3000` or `https://www.example.com`

* **providers** (REQUIRED)

  An array of [Providers](/providers) for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
* **database** (REQUIRED)

  A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.
* **secret** (RECOMMENDED)

  A random string used to hash tokens and sign cookies (e.g. SHA hash).
  
  If not provided will be auto-generated based on hash of all your provided options. The default behaviour is secure, but volatile, and so it is recommended you explicitly specify a value for your secret.
* **adapter** 

  An advanced option for specyfing a custom database adapter (see [Adapter](/adapters) for more information).

  If `adapter` is specified, overrides the `database` option.

* **sessionMaxAge** (default: `30*24*60*60*1000` - 30 days)

  How long sessions can be idle before expiring.
* **sessionUpdateAge** (default: `30*24*60*60*1000` - 24 hours)

  How frequently expiry date should be updated in the database (throttles database writes).
* **verificationMaxAge** (default: `30*24*60*60*1000` - 24 hours)

  How long links in verification emails are valid for (used for passwordless sign in).
* **pages**

  Specify custom URLs to be used for sign in, sign out and error pages.
* **debug** (default: `false`)

  Set debug to `true` to enable debug messages for all authenticaiton and database operations.

---

## Examples 

### Database

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

#### Supported Databases

* **SQLite**

  *SQLite is intended for development / testing use.*

  Install module:
  `npm i sqlite3`

  Database URI:<br/>
  `sqlite://localhost/:memory:?synchronize=true`

* **MySQL**

  Install module:
  `npm i mysql`

  Database URI:<br/>
  `mysql://username:password@127.0.0.1:3306/database_name?synchronize=true`

* **Postgres**

  Install module:
  `npm i pg`

  Database URI:<br/>
  `postgres://username:password@127.0.0.1:5432/database_name?synchronize=true`

* **MongoDB**

  Install module:
  `npm i mongo`

  Database URI:<br/>
  `mongodb://username:password@127.0.0.1:27017/database_name?synchronize=true`

:::tip
* When configuring your database you should also install an appropriate **npm module**
* **?synchronize=true** automatically syncs schema changes to the database. It is useful to create the tables you need in the database, but should not be enabled in production as may result in data loss if there are changes to the schema or to NextAuth.js
* See the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for supported options
:::


#### Advanced usage

The following databases are supported by the default TypeORM adapter:

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

NextAuth.js has not been tested with all of them and not all are supported for use with NextAuth.js but feedback, bug reports and patches are welcome.

If you want to customize, extend or replace the models, you can do this by using the 'adapters' option and passing passing additional options to `Adapters.Default()`.

See the [documentation for Adapaters](/adapters) for more information on advanced configuration.

### Pages

NextAuth.js automatically creates simple, unbranded authentication pages for handling Sign in, Email Verification, callbacks, etc. The options displayed are generated based on the configuration supplied.

To add a custom login page, for example. You must add a `pages` array to the config, for example:

```javascript title="/pages/api/auth/[...slug].js"
  ...
  pages: {
    signin: '/auth/signin',
    signout: '/auth/signout',
    checkEmail: '/auth/check-email',
    error: '/auth/error'
  }
  ...
```

Then you must create pages at the above routes. 

In the signin page, for example, in order to get the available providers you must make a request to `/api/auth/providers`.

```jsx title="/pages/auth/signin"
import React from 'react'

const SignIn = ({ providers }) => {
  return (
    <div>
      {providers && Object.values(providers).map(provider => (
        <p key={provider.name}>
          <a href={provider.signinUrl}>
            <Button type='submit' appearance='primary' block>Sign in with {provider.name}</Button>
          </a>
        </p>
      ))}
    </div>
  )
}

export default SignIn

export async function getServerSideProps ({ req }) {
  const host = req ? req.headers['x-forwarded-host'] : window.location.hostname
  let protocol = 'https:'
  if (host.indexOf('localhost') > -1) {
    protocol = 'http:'
  }
  const res = await fetch(`${protocol}//${host}/api/auth/providers`)
  const providers = await res.json()

  return {
    props: {
      providers
    }
  }
}
```
