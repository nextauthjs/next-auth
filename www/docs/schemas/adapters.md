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

To use this adapter, you need to install Prisma Client and Prisma CLI:

```
npm i @prisma/client
npm add -D @prisma/cli
```

Configure your NextAuth.js to use the Prisma adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const options = {
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

### Prisma Schema

Create a `schema.prisma` file similar to this one:

``` title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                 Int       @default(autoincrement()) @id
  compoundId         String    @unique @map(name: "compound_id")
  userId             Int       @map(name: "user_id")
  providerType       String    @map(name: "provider_type")
  providerId         String    @map(name: "provider_id")
  providerAccountId  String    @map(name: "provider_account_id")
  refreshToken       String?   @map(name: "refresh_token")
  accessToken        String?   @map(name: "access_token")
  accessTokenExpires DateTime? @map(name: "access_token_expires")
  createdAt          DateTime  @default(now()) @map(name: "created_at")
  updatedAt          DateTime  @default(now()) @map(name: "updated_at")

  @@index([providerAccountId], name: "providerAccountId")
  @@index([providerId], name: "providerId")
  @@index([userId], name: "userId")

  @@map(name: "accounts")
}

model Session {
  id           Int      @default(autoincrement()) @id
  userId       Int      @map(name: "user_id")
  expires      DateTime
  sessionToken String   @unique @map(name: "session_token")
  accessToken  String   @unique @map(name: "access_token")
  createdAt    DateTime @default(now()) @map(name: "created_at")
  updatedAt    DateTime @default(now()) @map(name: "updated_at")

  @@map(name: "sessions")
}

model User {
  id            Int       @default(autoincrement()) @id
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map(name: "email_verified")
  image         String?
  createdAt     DateTime  @default(now()) @map(name: "created_at")
  updatedAt     DateTime  @default(now()) @map(name: "updated_at")

  @@map(name: "users")
}

model VerificationRequest {
  id         Int      @default(autoincrement()) @id
  identifier String
  token      String   @unique
  expires    DateTime
  createdAt  DateTime  @default(now()) @map(name: "created_at")
  updatedAt  DateTime  @default(now()) @map(name: "updated_at")

  @@map(name: "verification_requests")
}
```

:::tip
You can add properties to the schema, but do not change the base properties or types.
:::

Once you have saved your schema, you can run the Prisma CLI to generate the Prisma Client:

```
npx @prisma/cli generate
```

#### Using custom model names

The properties in the models need to be defined as above, but the model names themselves can be changed with a configuration option, and the datasource can be changed to anything supported by Prisma. You can use custom model names by using the `modelMapping` option (shown here with default values).

```javascript title="pages/api/auth/[...nextauth].js"
...
adapter: Adapters.Prisma.Adapter({ 
  prisma,
  modelMapping: {
    User: 'user',
    Account: 'account',
    Session: 'session',
    VerificationRequest: 'verificationRequest'
  }  
})
...
```

:::tip
If you experience issues with Prisma opening too many database connections opening in local development mode (e.g. due to Hot Module Reloading) you can use an approach like this when initalising the Prisma Client:

```javascript title="pages/api/auth/[...nextauth].js"
let prisma

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}
```
:::


## Custom Adapter

See the tutorial for [creating a database adapter](/tutorials/creating-a-database-adapter) for more information on how to create a custom adapter.
