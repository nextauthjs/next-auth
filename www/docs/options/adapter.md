---
id: adapter
title: Database Adapters
---

An "*Adapter*" in NextAuth.js is the thing that connects your application to whatever database or backend system you want to use to store data for user accounts, sessions, etc.

*The **adapter** option is currently considered advanced usage intended for use by NextAuth.js contributors.*

## TypeORM (Default)

NextAuth.js comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be used with many different databases without any further configuration, you simply add the database driver you want to use to your project and tell  NextAuth.js to use it.

The default adapter comes with predefined models for **Users**, **Sessions**, **Account Linking** and **Verification Emails**. You can extend or replace the default models and schemas, or even provide your adapter to handle reading/writing from the database (or from multiple databases).

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc) and do not have to use the built in models.

If you are using a database that is not supported out of the box, or if you want to use  NextAuth.js with an existing database, or have a more complex setup with accounts and sessions spread across different systems then you can pass your own methods to be called for user and session creation / deletion (etc).

The default adapter is the TypeORM adapter, the following configuration options are exactly equivalent.

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

## Creating your own adapter

Using a custom adapter you can connect to any database backend or even several different databases.

As an example, one has already been created by a community member to use a [Prisma](https://www.prisma.io/) backend.

How to write your own adapter is not yet covered by this documentation and we are not able to provide support for it at this time, but if you want to figure it out on your own the API should be relatively stable.