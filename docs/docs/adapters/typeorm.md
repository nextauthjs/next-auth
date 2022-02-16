---
id: typeorm
title: TypeORM
---

# TypeORM

This Adapter is used to support SQL-flavored databases (like SQLite, MySQL, MSSQL, MariaDB, CockroachDB, etc.) through [TypeORM](https://typeorm.io), and mostly kept around for legacy reasons. (See the warning below.)

:::note
If you previously used this Adapter with MongoDB, check out the [MongoDB Adapter](/adapters/mongodb) instead.
:::

:::warning
In the future, we might split up this adapter to support single flavors of SQL for easier maintenance and reduced bundle size.
:::

## Usage

To use this Adapter, you need to install the following packages:

```bash npm2yarn
npm install next-auth @next-auth/typeorm-legacy-adapter typeorm
```

Configure your NextAuth.js to use the TypeORM Adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"


export default NextAuth({
  adapter: TypeORMLegacyAdapter("yourconnectionstring"),
  ...
})
```

`TypeORMLegacyAdapter` takes either a connection string, or a [`ConnectionOptions`](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md) object as its first parameter.

## Custom models

The TypeORM adapter uses [`Entity` classes](https://github.com/typeorm/typeorm/blob/master/docs/entities.md) to define the shape of your data.

If you want to override the default entities (for example to add a `role` field to your `UserEntity`), you will have to do the following:

> This schema is adapted for use in TypeORM and based upon our main [schema](/adapters/models)

1. Create a file containing your modified entities:

(The file below is based on the [default entities](https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-typeorm-legacy/src/entities.ts))

```diff title="lib/entities.ts"
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ValueTransformer,
} from "typeorm"

const transformer: Record<"date" | "bigint", ValueTransformer> = {
  date: {
    from: (date: string | null) => date && new Date(parseInt(date, 10)),
    to: (date?: Date) => date?.valueOf().toString(),
  },
  bigint: {
    from: (bigInt: string | null) => bigInt && parseInt(bigInt, 10),
    to: (bigInt?: number) => bigInt?.toString(),
  },
}

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "varchar", nullable: true })
  name!: string | null

  @Column({ type: "varchar", nullable: true, unique: true })
  email!: string | null

  @Column({ type: "varchar", nullable: true, transformer: transformer.date })
  emailVerified!: string | null

  @Column({ type: "varchar", nullable: true })
  image!: string | null

+ @Column({ type: "varchar", nullable: true })
+ role!: string | null

  @OneToMany(() => SessionEntity, (session) => session.userId)
  sessions!: SessionEntity[]

  @OneToMany(() => AccountEntity, (account) => account.userId)
  accounts!: AccountEntity[]
}

@Entity({ name: "accounts" })
export class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ type: "uuid" })
  userId!: string

  @Column()
  type!: string

  @Column()
  provider!: string

  @Column()
  providerAccountId!: string

  @Column({ type: "varchar", nullable: true })
  refresh_token!: string

  @Column({ type: "varchar", nullable: true })
  access_token!: string | null

  @Column({
    nullable: true,
    type: "bigint",
    transformer: transformer.bigint,
  })
  expires_at!: number | null

  @Column({ type: "varchar", nullable: true })
  token_type!: string | null

  @Column({ type: "varchar", nullable: true })
  scope!: string | null

  @Column({ type: "varchar", nullable: true })
  id_token!: string | null

  @Column({ type: "varchar", nullable: true })
  session_state!: string | null

  @Column({ type: "varchar", nullable: true })
  oauth_token_secret!: string | null

  @Column({ type: "varchar", nullable: true })
  oauth_token!: string | null

  @ManyToOne(() => UserEntity, (user) => user.accounts, {
    createForeignKeyConstraints: true,
  })
  user!: UserEntity
}

@Entity({ name: "sessions" })
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ unique: true })
  sessionToken!: string

  @Column({ type: "uuid" })
  userId!: string

  @Column({ transformer: transformer.date })
  expires!: string

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user!: UserEntity
}

@Entity({ name: "verification_tokens" })
export class VerificationTokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  token!: string

  @Column()
  identifier!: string

  @Column({ transformer: transformer.date })
  expires!: string
}
```

2. Pass them to `TypeORMLegacyAdapter`

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"
import * as entities from "lib/entities"

export default NextAuth({
  adapter: TypeORMLegacyAdapter("yourconnectionstring", { entities }),
  ...
})
```

:::tip Synchronize your database ♻
The `synchronize: true` option in TypeORM will generate SQL that exactly matches the entities. This will automatically apply any changes it finds in the entity model. This is a useful option in development.
:::

:::warning Using synchronize in production
`synchronize: true` should not be enabled against production databases as it may cause data loss if the configured schema does not match the expected schema! We recommend that you synchronize/migrate your production database at build-time.
:::

## Naming Conventions

If mixed snake_case and camelCase column names are an issue for you and/or your underlying database system, we recommend using TypeORM's naming strategy feature to change the target field names. There is a package called `typeorm-naming-strategies` which includes a `snake_case` strategy which will translate the fields from how NextAuth.js expects them, to snake_case in the actual database.

For example, you can add the naming convention option to the connection object in your NextAuth config.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { ConnectionOptions } from "typeorm"

const connection: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    namingStrategy: new SnakeNamingStrategy()
}

export default NextAuth({
  adapter: TypeORMLegacyAdapter(connection),
  ...
})
```
