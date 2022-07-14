---
id: prisma
title: Prisma
---

# Prisma

To use this Adapter, you need to install Prisma Client, Prisma CLI, and the separate `@next-auth/prisma-adapter` package:

```bash npm2yarn
npm install next-auth @prisma/client @next-auth/prisma-adapter
npm install prisma --save-dev
```

Configure your NextAuth.js to use the Prisma Adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

Schema for the Prisma Adapter (`@next-auth/prisma-adapter`)

## Setup

### Create the Prisma schema

You need to use at least Prisma 2.26.0. Create a schema file in `prisma/schema.prisma` similar to this one:

> This schema is adapted for use in Prisma and based upon our main [schema](/adapters/models)

```json title="schema.prisma"
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL") // Only needed when using a cloud provider that doesn't support the creation of new databases, like Heroku. Learn more: https://pris.ly/migrate-shadow
}

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["referentialActions"] // You won't need this in Prisma 3.X or higher.
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String?  @db.Text
  access_token       String?  @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String?  @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

:::note
When using the MySQL connector for Prisma, the [Prisma `String` type](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string) gets mapped to `varchar(191)` which may not be long enough to store fields such as `id_token` in the `Account` model. This can be avoided by explicitly using the `Text` type with `@db.Text`.
:::

### Create the database schema with Prisma Migrate

```
npx prisma migrate dev
```

This will create an SQL migration file and execute it.

Note that you will need to specify your database connection string in the environment variable `DATABASE_URL`. You can do this by setting it in a `.env` file at the root of your project.

To learn more about [Prisma Migrate](https://www.prisma.io/migrate), check out the [Migrate docs](https://www.prisma.io/docs/concepts/components/prisma-migrate).

### Generate Client

Once you have saved your schema, use the Prisma CLI to generate the Prisma Client:

```
npx prisma generate
```

To configure your database to use the new schema (i.e. create tables and columns) use the `prisma migrate` command:

```
npx prisma migrate dev
```

### MongoDB

Prisma supports MongoDB, and so does NextAuth.js. Following the instructions of the [Prisma documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb) on the MongoDB connector, things you have to change are:

1. Make sure that the id fields are mapped correctly

```prisma
id  String  @id @default(auto()) @map("_id") @db.ObjectId
```

2. The Native database type attribute to `@db.String` from `@db.Text`.

```prisma
refresh_token      String?  @db.String
access_token       String?  @db.String
id_token           String?  @db.String
```

Everything else should be the same.

## Naming Conventions

If mixed snake_case and camelCase column names is an issue for you and/or your underlying database system, we recommend using Prisma's `@map()`([see the documentation here](https://www.prisma.io/docs/concepts/components/prisma-schema/names-in-underlying-database)) feature to change the field names. This won't affect NextAuth.js, but will allow you to customize the column names to whichever naming convention you wish.

For example, moving to `snake_case` and plural table names.

```json title="schema.prisma"
model Account {
  id                 String  @id @default(cuid())
  userId             String  @map("user_id")
  type               String
  provider           String
  providerAccountId  String  @map("provider_account_id")
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime? @map("email_verified")
  image         String?
  accounts      Account[]
  sessions      Session[]

  @@map("users")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}
```
