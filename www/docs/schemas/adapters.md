---
id: adapters
title: Database Adapters
---

An **Adapter** in NextAuth.js connects your application to whatever database or backend system you want to use to store data for user accounts, sessions, etc.

You do not need to specify an adapter explicltly unless you want to use advanced options such as custom models or schemas, or if you are creating a custom adapter to connect to a database that is not one of the supported databases.

## TypeORM Adapter

NextAuth.js comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be used with many different databases without any further configuration, you simply add the database driver you want to use to your project and tell  NextAuth.js to use it.

The default adapter comes with predefined models for **Users**, **Sessions**, **Account Linking** and **Verification Emails**. You can extend or replace the default models and schemas, or even provide your adapter to handle reading/writing from the database (or from multiple databases).

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc) and do not have to use the built in models.

If you are using a database that is not supported out of the box, or if you want to use  NextAuth.js with an existing database, or have a more complex setup with accounts and sessions spread across different systems then you can pass your own methods to be called for user and session creation / deletion (etc).

The default adapter is the TypeORM adapter, the following configuration options are exactly equivalent.

```javascript
database: {
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
}
```

```javascript
adapter: Adapters.Default({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```

```javascript
adapter: Adapters.TypeORM.Adapter({
  type: 'sqlite',
  database: ':memory:',
  synchronize: true
})
```

## Prisma Adapter

You can also use NextAuth.js with [Prisma](https://www.prisma.io/docs/).

To use this adapter, configure your `[...nextauth].js` like this:

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const options = {
  site: 'http://localhost:3000',
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
}

export default (req, res) => NextAuth(req, res, options)
```

You should use a `schema.prisma` file similar to this one:

```
datasource sqlite {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @default(uuid()) @id
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  name          String?
  sessions      Session[]
  accounts      Account[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt @default(now())
}

model Session {
  id                 String    @default(uuid()) @id
  userId             String
  user               User      @relation(fields: [userId], references: [id])
  accessToken        String    @default(cuid()) @unique
  sessionToken       String    @default(cuid()) @unique
  accessTokenExpires DateTime?
  expires            DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt @default(now())
}

model Account {
  id                 String    @default(uuid()) @id
  compoundId         String    @unique
  userId             String
  user               User      @relation(fields: [userId], references: [id])
  providerId         String
  providerType       String
  providerAccountId  String    @unique
  refreshToken       String?
  accessToken        String?
  accessTokenExpires DateTime?
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt @default(now())
}

model VerificationRequest {
  id         String   @default(uuid()) @id
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt @default(now())
}
```

:::tip
You can add properties to the schema, but do not change the base properties or types.
:::

#### Using custom model names

The properties in the models need to be defined as above, but the model names themselves can be changed with a configuration option, and the datasource can be changed to what you want.

This example shows using `model ProviderAccount` instead of `model Account` and `model Verification` instead of `model VerificationRequest`:

```javascript
...
adapter: Adapters.Prisma.Adapter({ 
  prisma,
  modelMapping: {
    User: 'user',
    Account: 'providerAccount',
    Session: 'session',
    VerificationRequest: 'verification'
  }  
})
...
```

## Custom Adapter

See the tutorial for [creating a database adapter](/tutorials/creating-a-database-adapter) for more information on how to create a custom adapter.
