---
id: configuration
title: Configuration
---
*This documentation is for next-auth@beta and is not complete. It will be updated closer to release.*

Configuration options are passed to NextAuth.js when initalizing it (in your `/pages/api/auth` route).

The only required options are **site**, **providers** and **database**.

## Options

* **site** (REQUIRED)

  The fully qualified URL of your site e.g. `http://localhost:3000` or `https://www.example.com`

* **providers** (REQUIRED)

  An array of [Providers](/providers) for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
* **database** (REQUIRED)

  A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.
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

## Configuration Examples 

### Database Configuration

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

#### Supported Databases

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

Appropriate tables / collections for Users, Sessions (etc) will be created automatically if they do not exist.

If you want to customize, extend or replace the models, you can do this by using the 'adapters' option and passing passing additional options to `Adapters.Default()`.

:::caution
 * Supported databases and models/schemas subject to change before release.
 * Initial target platforms include MySQL, MariaDB, Postgress and MongoDB.
:::

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
