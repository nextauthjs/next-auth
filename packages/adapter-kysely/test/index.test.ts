import { describe } from "vitest"
import { runBasicTests } from "utils/adapter"
import { Pool } from "pg"
import {
  Dialect,
  MysqlDialect,
  PostgresDialect,
  SchemaModule,
  sql,
  SqliteAdapter,
  SqliteDialect,
} from "kysely"
import { createPool } from "mysql2"
import SqliteDatabase from "libsql"
import { KyselyAdapter, KyselyAuth } from "../src"
import type { Database } from "../src"

export function createTableWithId(
  schema: SchemaModule,
  dialect: string,
  tableName: string
) {
  const builder = schema.createTable(tableName)
  switch (dialect) {
    case "postgres":
      return builder.addColumn("id", "uuid", (col) =>
        col.primaryKey().defaultTo(sql`gen_random_uuid()`)
      )
    case "mysql":
      return builder.addColumn("id", "varchar(36)", (col) =>
        col.primaryKey().defaultTo(sql`(UUID())`)
      )
    case "sqlite":
      return builder.addColumn("id", "varchar", (col) => col.primaryKey())
    default:
      throw new Error("Unsupported dialect")
  }
}

const withSchema =
  (schemaName?: string) =>
  (db: KyselyAuth<Database, Database>, isSqlite: boolean) =>
    schemaName && !isSqlite ? db.withSchema(schemaName) : db

interface CreateDb {
  schemaName?: string
  db: KyselyAuth<Database, Database>
  dialect: Dialect
}
const createDb = ({ schemaName, db, dialect }: CreateDb) => {
  const { adapter } = db.getExecutor()
  const isSqlite = adapter instanceof SqliteAdapter
  const isMysql = dialect instanceof MysqlDialect

  return {
    async connect() {
      const dialect = isSqlite ? "sqlite" : isMysql ? "mysql" : "postgres"
      if (schemaName && dialect !== "sqlite") {
        db.schema.createSchema(schemaName).ifNotExists().execute()
      }
      const schema =
        schemaName && dialect !== "sqlite"
          ? db.schema.withSchema(schemaName)
          : db.schema
      await Promise.all([
        schema.dropTable("Account").ifExists().execute(),
        schema.dropTable("Session").ifExists().execute(),
        schema.dropTable("User").ifExists().execute(),
        schema.dropTable("VerificationToken").ifExists().execute(),
      ])

      const defaultTimestamp = {
        postgres: sql`NOW()`,
        mysql: sql`NOW(3)`,
        sqlite: sql`CURRENT_TIMESTAMP`,
      }[dialect]
      const uuidColumnType = dialect === "mysql" ? "varchar(36)" : "uuid"
      const dateColumnType =
        dialect === "mysql" ? sql`DATETIME(3)` : "timestamptz"
      const textColumnType = dialect === "mysql" ? "varchar(255)" : "text"

      await createTableWithId(schema, dialect, "User")
        .addColumn("name", textColumnType)
        .addColumn("email", textColumnType, (col) => col.unique().notNull())
        .addColumn("emailVerified", dateColumnType, (col) =>
          col.defaultTo(defaultTimestamp)
        )
        .addColumn("image", textColumnType)
        .execute()

      let createAccountTable = schema
        .createTable("Account")
        .addColumn("userId", uuidColumnType, (col) =>
          col.references("User.id").onDelete("cascade").notNull()
        )
        .addColumn("type", textColumnType, (col) => col.notNull())
        .addColumn("provider", textColumnType, (col) => col.notNull())
        .addColumn("providerAccountId", textColumnType, (col) => col.notNull())
        .addColumn("refresh_token", textColumnType)
        .addColumn("access_token", textColumnType)
        .addColumn("expires_at", "bigint")
        .addColumn("token_type", textColumnType)
        .addColumn("scope", textColumnType)
        .addColumn("id_token", textColumnType)
        .addColumn("session_state", textColumnType)
      if (dialect === "mysql")
        createAccountTable = createAccountTable.addForeignKeyConstraint(
          "Account_userId_fk",
          ["userId"],
          "User",
          ["id"],
          (cb) => cb.onDelete("cascade")
        )
      await createAccountTable.execute()

      let createSessionTable = schema
        .createTable("Session")
        .addColumn("userId", uuidColumnType, (col) =>
          col.references("User.id").onDelete("cascade").notNull()
        )
        .addColumn("sessionToken", textColumnType, (col) =>
          col.notNull().unique()
        )
        .addColumn("expires", dateColumnType, (col) => col.notNull())

      if (dialect === "mysql")
        createSessionTable = createSessionTable.addForeignKeyConstraint(
          "Session_userId_fk",
          ["userId"],
          "User",
          ["id"],
          (cb) => cb.onDelete("cascade")
        )

      await createSessionTable.execute()

      await schema
        .createTable("VerificationToken")
        .addColumn("identifier", textColumnType, (col) => col.notNull())
        .addColumn("token", textColumnType, (col) => col.notNull().unique())
        .addColumn("expires", dateColumnType, (col) => col.notNull())
        .execute()

      await schema
        .createIndex("Account_userId_index")
        .on("Account")
        .column("userId")
        .execute()
    },
    async disconnect() {
      await db.destroy()
    },
    async user(userId) {
      const _db = withSchema(schemaName)(db, isSqlite)
      const user = await _db
        .selectFrom("User")
        .selectAll()
        .where("id", "=", userId)
        .executeTakeFirst()
      if (isSqlite && user?.emailVerified)
        user.emailVerified = new Date(user.emailVerified)
      return user ?? null
    },
    async account({ provider, providerAccountId }) {
      const _db = withSchema(schemaName)(db, isSqlite)
      const result = await _db
        .selectFrom("Account")
        .selectAll()
        .where("provider", "=", provider)
        .where("providerAccountId", "=", providerAccountId)
        .executeTakeFirst()
      if (!result) return null
      const { ...account } = result
      if (typeof account.expires_at === "string")
        account.expires_at = Number(account.expires_at)
      return account ?? null
    },
    async session(sessionToken) {
      const _db = withSchema(schemaName)(db, isSqlite)
      const session = await _db
        .selectFrom("Session")
        .selectAll()
        .where("sessionToken", "=", sessionToken)
        .executeTakeFirst()
      if (isSqlite && session?.expires)
        session.expires = new Date(session.expires)
      return session ?? null
    },
    async verificationToken({ identifier, token }) {
      const _db = withSchema(schemaName)(db, isSqlite)
      const verificationToken = await _db
        .selectFrom("VerificationToken")
        .selectAll()
        .where("identifier", "=", identifier)
        .where("token", "=", token)
        .executeTakeFirstOrThrow()
      if (isSqlite)
        verificationToken.expires = new Date(verificationToken.expires)
      return verificationToken ?? null
    },
  }
}

describe.each([
  new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      database: "kysely_test",
      user: "kysely",
      port: 5434,
      max: 20,
    }),
  }),
  new MysqlDialect({
    pool: createPool({
      database: "kysely_test",
      host: "localhost",
      user: "kysely",
      password: "kysely",
      port: 3308,
      supportBigNumbers: true,
      bigNumberStrings: true,
      connectionLimit: 20,
    }),
  }),
  new SqliteDialect({
    database: async () => new SqliteDatabase(":memory:"),
  }),
])("Testing %s dialect", (dialect) => {
  const db = new KyselyAuth<Database>({ dialect })
  runBasicTests({
    adapter: KyselyAdapter(db),
    db: createDb({ db, dialect }),
  })
})
describe.each([
  new PostgresDialect({
    pool: new Pool({
      host: "localhost",
      database: "kysely_test",
      user: "kysely",
      port: 5434,
      max: 20,
    }),
  }),
  new MysqlDialect({
    pool: createPool({
      database: "kysely_test",
      host: "localhost",
      user: "kysely",
      password: "kysely",
      port: 3308,
      supportBigNumbers: true,
      bigNumberStrings: true,
      connectionLimit: 20,
    }),
  }),
  new SqliteDialect({
    database: async () => new SqliteDatabase(":memory:"),
  }),
])("Testing %s dialect", (dialect) => {
  const db = new KyselyAuth<Database>({ dialect })
  runBasicTests({
    adapter: KyselyAdapter(db, { schemaName: "testSchema" }),
    db: createDb({ schemaName: "testSchema", db, dialect }),
  })
})
