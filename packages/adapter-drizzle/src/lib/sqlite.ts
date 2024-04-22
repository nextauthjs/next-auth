import { and, eq } from "drizzle-orm"
import {
  BaseSQLiteDatabase,
  SQLiteColumn,
  SQLiteTableWithColumns,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

import { randomUUID } from "crypto"

export const sqliteUsersTable = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

export const sqliteAccountsTable = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => sqliteUsersTable.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sqliteSessionsTable = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => sqliteUsersTable.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const sqliteVerificationTokensTable = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export function SQLiteDrizzleAdapter(
  client: BaseSQLiteDatabase<"sync" | "async", any, any>,
  schema: DefaultSQLiteSchema = {
    usersTable: sqliteUsersTable,
    accountsTable: sqliteAccountsTable,
    sessionsTable: sqliteSessionsTable,
    verificationTokensTable: sqliteVerificationTokensTable,
  }
): Adapter {
  const { usersTable, accountsTable, sessionsTable, verificationTokensTable } =
    schema

  return {
    async createUser(data: AdapterUser) {
      return client.insert(usersTable).values(data).returning().get()
    },
    async getUser(userId: string) {
      const result = await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .get()

      return result ?? null
    },
    async getUserByEmail(email: string) {
      const result = await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .get()

      return result ?? null
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      return await client.insert(sessionsTable).values(data).returning().get()
    },
    async getSessionAndUser(sessionToken: string) {
      const result = await client
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
        .get()

      return result ?? null
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const result = await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning()
        .get()

      if (!result) {
        throw new Error("User not found.")
      }

      return result
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      const result = await client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .returning()
        .get()

      return result ?? null
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountsTable).values(data).run()
    },
    async getUserByAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      const result = await client
        .select({
          account: accountsTable,
          user: usersTable,
        })
        .from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id))
        .where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId)
          )
        )
        .get()

      return result?.user ?? null
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .run()
    },
    async createVerificationToken(data: VerificationToken) {
      return await client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .get()
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      const result = await client
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token)
          )
        )
        .returning()
        .get()

      return result ?? null
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id)).run()
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      await client
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId)
          )
        )
        .run()
    },
  }
}

export type DefaultSQLiteUsersTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    id: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    name: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    email: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    emailVerified: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      driverParam: number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    image: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteAccountsTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    userId: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    type: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    provider: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    providerAccountId: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    refresh_token: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    access_token: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    expires_at: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "number"
      columnType: "SQLiteInteger"
      data: number
      driverParam: number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    token_type: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    scope: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    id_token: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    session_state: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteSessionsTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    sessionToken: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    userId: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    expires: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      driverParam: number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteVerificationTokenTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    identifier: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    token: SQLiteColumn<{
      name: string
      columnType: "SQLiteText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    expires: SQLiteColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      driverParam: number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteSchema = {
  usersTable: DefaultSQLiteUsersTable
  accountsTable: DefaultSQLiteAccountsTable
  sessionsTable: DefaultSQLiteSessionsTable
  verificationTokensTable: DefaultSQLiteVerificationTokenTable
}
