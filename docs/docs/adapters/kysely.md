---
id: kysely
title: Kysely
---

# Kysely

To use this Adapter, you need to install kysely, a dialect of your choice (we're using [`pg`](https://www.npmjs.com/package/pg) for PostgreSQL with the examples below), and the separate `@next-auth/kysely-adapter` package.

This Adapter supports the same dialects that Kysely (as of v0.21.6) supports: PostgreSQL, MySQL, and SQLite.

```bash npm2yarn2pnpm
npm install next-auth kysely pg @next-auth/kysely-adapter
npm install --save-dev @types/pg
```

Configure your NextAuth.js to use the Kysely Adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { KyselyAdapter } from "@next-auth/kysely-adapter"
import { db } from "../../../db"

export default NextAuth({
  adapter: KyselyAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

## Setup

[Kysely](https://github.com/koskimas/kysely) (pronounce “Key-Seh-Lee”) is a type-safe and autocompletion-friendly TypeScript SQL query builder inspired by Knex. To use Kysely, you define interfaces for each of your database tables and pass them to the `Kysely` constructor.

### Create type definitions and the Kysely instance

This Adapter exports a wrapper around the original Kysely class, `AuthedKysely`, that can be used to provide an additional level of type safety. While using it isn't required, it is recommended as it will verify that the database interface has all the fields that NextAuth.js requires.

:::note
An alternative to manually defining types is generating them from the database schema using [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen). When using the generated types with AuthedKysely, import `Codegen` and pass it as the second generic arg:

```ts
import type { Codegen } from "@next-auth/kysely-adapter"
new AuthedKysely<Database, Codegen>(...)

```

:::

```ts title="db/index.ts"
import { PostgresDialect } from "kysely"
import type { Generated } from "kysely"
import { Pool } from "pg"
import { AuthedKysely } from "@next-auth/kysely-adapter"

interface User {
  id: Generated<string>
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
}

interface Account {
  id: Generated<string>
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string | null
  access_token: string | null
  expires_at: number | null
  token_type: string | null
  scope: string | null
  id_token: string | null
  session_state: string | null
  oauth_token_secret: string | null
  oauth_token: string | null
}

interface Session {
  id: Generated<string>
  userId: string
  sessionToken: string
  expires: Date
}

interface VerificationToken {
  identifier: string
  token: string
  expires: Date
}

export interface Database {
  User: User
  Account: Account
  Session: Session
  VerificationToken: VerificationToken
}

export const db = new AuthedKysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    }),
  }),
})
```

### Create migrations

This schema is based on the NextAuth.js main [schema](/adapters/models).

```ts title="db/migrations/001_create_db.ts"
import { Kysely, sql } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("User")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique())
    .addColumn("emailVerified", "timestamptz", (col) =>
      col.defaultTo(sql`NOW()`)
    )
    .addColumn("image", "text")
    .execute()

  await db.schema
    .createTable("Account")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .addColumn("oauth_token_secret", "text")
    .addColumn("oauth_token", "text")
    .execute()

  await db.schema
    .createTable("Session")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute()

  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex("Account_userId_index")
    .on("Account")
    .column("userId")
    .execute()

  await db.schema
    .createIndex("Session_userId_index")
    .on("Session")
    .column("userId")
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute()
  await db.schema.dropTable("Session").ifExists().execute()
  await db.schema.dropTable("User").ifExists().execute()
  await db.schema.dropTable("VerificationToken").ifExists().execute()
}
```

### Create migration runner

Install `@next/env` and then create a script to run the migrations.

```bash npm2yarn2pnpm
npm install @next/env
```

```ts title="db/migrate.ts"
import * as path from "path"
import { promises as fs } from "fs"
import { Database } from "."
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from "kysely"
import { Pool } from "pg"
import { loadEnvConfig } from "@next/env"

loadEnvConfig(process.cwd())

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error("failed to migrate")
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
```

### Run the migrations

```ts
npx tsx db/migrate.ts
```

## Naming Conventions

If mixed snake_case and camelCase column names is an issue for you and/or your underlying database system, we recommend using Kysely's `CamelCasePlugin` ([see the documentation here](https://koskimas.github.io/kysely/classes/CamelCasePlugin.html)) feature to change the field names. This won't affect NextAuth.js, but will allow you to have consistent casing when using Kysely.
