import { and, eq } from "drizzle-orm"
import {
  MySqlColumn,
  MySqlDatabase,
  MySqlTableWithColumns,
  PreparedQueryHKTBase,
  QueryResultHKT,
  int,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

import { randomUUID } from "crypto"

export const mysqlUsersTable = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: varchar("image", { length: 255 }),
})

export const mysqlAccountsTable = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => mysqlUsersTable.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compositePk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const mysqlSessionsTable = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => mysqlUsersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const mysqlVerificationTokensTable = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export function MySqlDrizzleAdapter(
  client: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase, any>,
  schema: DefaultMySqlSchema = {
    usersTable: mysqlUsersTable,
    accountsTable: mysqlAccountsTable,
    sessionsTable: mysqlSessionsTable,
    verificationTokensTable: mysqlVerificationTokensTable,
  }
): Adapter {
  const { usersTable, accountsTable, sessionsTable, verificationTokensTable } =
    schema

  return {
    async createUser(data: AdapterUser) {
      await client.insert(usersTable).values(data)

      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, data.email))
        .then((res) => res[0])
    },
    async getUser(userId: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async getUserByEmail(email: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      await client.insert(sessionsTable).values(data)

      return client
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .then((res) => res[0])
    },
    async getSessionAndUser(sessionToken: string) {
      return client
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
        .then((res) => (res.length > 0 ? res[0] : null))
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))

      const [result] = await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, data.id))

      if (!result) {
        throw new Error("No user found.")
      }

      return result
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      await client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))

      return client
        .select()
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .then((res) => res[0])
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountsTable).values(data)
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
        .then((res) => res[0])

      return result?.user ?? null
    },
    async deleteSession(sessionToken: string) {
      await client
        .delete(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
    },
    async createVerificationToken(data: VerificationToken) {
      await client.insert(verificationTokensTable).values(data)

      return client
        .select()
        .from(verificationTokensTable)
        .where(eq(verificationTokensTable.identifier, data.identifier))
        .then((res) => res[0])
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      const deletedToken = await client
        .select()
        .from(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token)
          )
        )
        .then((res) => (res.length > 0 ? res[0] : null))

      if (deletedToken) {
        await client
          .delete(verificationTokensTable)
          .where(
            and(
              eq(verificationTokensTable.identifier, params.identifier),
              eq(verificationTokensTable.token, params.token)
            )
          )
      }

      return deletedToken
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id))
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
    },
  }
}

export type DefaultMySqlUsersTable = MySqlTableWithColumns<{
  name: string
  columns: {
    id: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    name: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    email: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    emailVerified: MySqlColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "MySqlTimestamp"
      data: Date
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    image: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlAccountsTable = MySqlTableWithColumns<{
  name: string
  columns: {
    userId: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    type: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    provider: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    providerAccountId: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    refresh_token: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    access_token: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    expires_at: MySqlColumn<{
      name: string
      tableName: string
      dataType: "number"
      columnType: "MySqlInt"
      data: number
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    token_type: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    scope: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    id_token: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    session_state: MySqlColumn<{
      name: string
      tableName: string
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlSessionsTable = MySqlTableWithColumns<{
  name: string
  columns: {
    sessionToken: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    userId: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    expires: MySqlColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "MySqlTimestamp"
      data: Date
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlVerificationTokenTable = MySqlTableWithColumns<{
  name: string
  columns: {
    identifier: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    token: MySqlColumn<{
      name: string
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: "string"
      tableName: string
    }>
    expires: MySqlColumn<{
      name: string
      tableName: string
      dataType: "date"
      columnType: "MySqlTimestamp"
      data: Date
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlSchema = {
  usersTable: DefaultMySqlUsersTable
  accountsTable: DefaultMySqlAccountsTable
  sessionsTable: DefaultMySqlSessionsTable
  verificationTokensTable: DefaultMySqlVerificationTokenTable
}
