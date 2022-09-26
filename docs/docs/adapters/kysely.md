---
id: kysely
title: Kysely
---

# Kysely

To use this Adapter, you need to install kysely, pg (for PostgreSQL with the examples below),  and the separate `@next-auth/kysely-adapter` package.

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
});
```

## Setup

[Kysely](https://github.com/koskimas/kysely) (pronounce “Key-Seh-Lee”) is a type-safe and autocompletion-friendly typescript SQL query builder inspired by knex. To use Kysely, you define interfaces for each of your database tables and pass them to the `Kysely` constructor.

### Create type definitions and the Kysely instance
:::note
An alternative to manually defining types is generating them from the database schema using [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen).
:::
```ts title="db/index.ts"
import { Kysely, PostgresDialect } from "kysely";
import type { Generated } from "kysely";
import { Pool } from "pg";

interface User {
  id: Generated<string>;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
}

interface Account {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  oauth_token_secret: string | null;
  oauth_token: string | null;
}

interface Session {
  id: Generated<string>;
  userId: string;
  sessionToken: string;
  expires: Date;
}

interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export interface Database {
  User: User;
  Account: Account;
  Session: Session;
  VerificationToken: VerificationToken;
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    }),
  }),
});

```

### Create migrations

This schema is based on the NextAuth main [schema](/adapters/models).
```ts title="db/migrations/001_create_db.ts"
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`.execute(db);

  await db.schema
    .createTable("User")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "varchar(255)")
    .addColumn("email", "varchar(255)", (col) => col.unique())
    .addColumn("emailVerified", "timestamptz", (col) =>
      col.defaultTo(sql`NOW()`)
    )
    .addColumn("image", "varchar(255)")
    .execute();

  await db.schema
    .createTable("Account")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "varchar(255)", (col) => col.notNull())
    .addColumn("provider", "varchar(255)", (col) => col.notNull())
    .addColumn("providerAccountId", "varchar(255)", (col) => col.notNull())
    .addColumn("refresh_token", "varchar(255)")
    .addColumn("access_token", "varchar(255)")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "varchar(255)")
    .addColumn("scope", "varchar(255)")
    .addColumn("id_token", "varchar(255)")
    .addColumn("session_state", "varchar(255)")
    .addColumn("oauth_token_secret", "varchar(255)")
    .addColumn("oauth_token", "varchar(255)")
    .execute();

  await db.schema
    .createTable("Session")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "varchar(255)", (col) => col.notNull())
    .addColumn("token", "varchar(255)", (col) => col.notNull().unique())
    .addColumn("expires", "timestamptz", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute();
  await db.schema.dropTable("Session").ifExists().execute();
  await db.schema.dropTable("User").ifExists().execute();
  await db.schema.dropTable("VerificationToken").ifExists().execute();
}
```

### Create migration runner
Install `@next/env` and then create a script to run the migrations.

```bash npm2yarn2pnpm
npm install @next/env
```

```ts title="db/migrate.ts"
import * as path from "path";
import { promises as fs } from "fs";
import { Database } from ".";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from "kysely";
import { Pool } from "pg";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

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
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();

```

### Run the migrations
```ts
npx tsx db/migrate.ts

