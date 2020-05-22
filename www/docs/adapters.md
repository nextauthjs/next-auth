---
id: adapters
title: Adapters
---

An "*Adapter*" in NextAuth.js is the thing that connects your application to whatever database / backend system you want to use to store data for user accounts, sessions, etc.

NextAuth.js comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be used with many different databases without any further configuration, you simply add the database driver you want to use to your project and tell  NextAuth.js to use it.

The default adapter comes with predefined models for Users and Sessions. You can extend or replace the default models and schemas, or even provide your adapter to handle reading/writing from the database (or from multiple databases).

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc) and do not have to use the built in models.

*Adapters are considered advanced usage are are not yet documented.*

```
// Database options - the default adapter is TypeORM
// See https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
const database = {
  type: 'sqlite',
  database: ':memory:',
   synchronize: true
}
```

:::note
Database options - the default adapter is TypeORM
See https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
:::