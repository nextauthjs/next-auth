---
id: adapters
title: Adapters
---

An "*Adapter*" in NextAuth.js is the thing that connects your application to whatever database / backend system you want to use to store data for user accounts, sessions, etc.

*Adapters are considered advanced usage are are not fully documented yet.*

## Default Adapter

NextAuth.js comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be used with many different databases without any further configuration, you simply add the database driver you want to use to your project and tell  NextAuth.js to use it.

The default adapter comes with predefined models for **Users**, **Sessions**, **Account Linking** and **Verification Emails**. You can extend or replace the default models and schemas, or even provide your adapter to handle reading/writing from the database (or from multiple databases).

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc) and do not have to use the built in models.

If you are using a database that is not supported out of the box, or if you want to use  NextAuth.js with an existing database, or have a more complex setup with accounts and sessions spread across different systems then you can pass your own methods to be called for user and session creation / deletion (etc).

If you only want to specify a database, you don't need to use the **adapter** option, the following are equivalent:

### Using the database option

```javascript title="/page/api/auth/[...slug].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: process.env.SITE || 'http://localhost:3000',
  providers: [
    Providers.EMAIL({
      server: process.env.EMAIL_SERVER,
      from: process.env.MAIL_FROM,
    }),
  ],
  database: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true
  }
}

export default (req, res) => NextAuth(req, res, options)
```

### Using the provider adapter

```javascript title="/page/api/auth/[...slug].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'

const options = {
  site: process.env.SITE || 'http://localhost:3000',
  providers: [
    Providers.EMAIL({
      server: process.env.EMAIL_SERVER,
      from: process.env.MAIL_FROM,
    }),
  ],
  adapter: Adapters.Default({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true
  })
}

export default (req, res) => NextAuth(req, res, options)
```

### Using the TypeORM adapter

The default adapter is TypeORM, the following configuration options are exactly equivalent.

```javascript
provider: Adapters.Default({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```


```javascript
provider: Adapters.TypeORM({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```

```javascript
database: {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
}
```

### How to create an adapter

It is possible to create your own adapter, in fact someone has already done this for a [Prisma](https://www.prisma.io/) backend.

Using a custom adapter you can connect to any database backend (or even several different databases!).

How to do write your own adapter is not yet documented, but will be once the internal API is final.