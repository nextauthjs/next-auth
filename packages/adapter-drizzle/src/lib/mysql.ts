import { and, eq, getTableColumns } from "drizzle-orm"
import {
  MySqlColumn,
  MySqlDatabase,
  MySqlTableWithColumns,
  PreparedQueryHKTBase,
  QueryResultHKT,
  int,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterAccountType,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

export function defineTables(
  schema: Partial<DefaultMySqlSchema> = {}
): Required<DefaultMySqlSchema> {
  const usersTable =
    schema.usersTable ??
    (mysqlTable("user", {
      id: varchar("id", { length: 255 })
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: varchar("name", { length: 255 }),
      email: varchar("email", { length: 255 }).notNull(),
      emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
      image: varchar("image", { length: 255 }),
    }) satisfies DefaultMySqlUsersTable)

  const accountsTable =
    schema.accountsTable ??
    (mysqlTable(
      "account",
      {
        userId: varchar("userId", { length: 255 })
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        type: varchar("type", { length: 255 })
          .$type<AdapterAccountType>()
          .notNull(),
        provider: varchar("provider", { length: 255 }).notNull(),
        providerAccountId: varchar("providerAccountId", {
          length: 255,
        }).notNull(),
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
    ) satisfies DefaultMySqlAccountsTable)

  const sessionsTable =
    schema.sessionsTable ??
    (mysqlTable("session", {
      sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
      userId: varchar("userId", { length: 255 })
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    }) satisfies DefaultMySqlSessionsTable)

  const verificationTokensTable =
    schema.verificationTokensTable ??
    (mysqlTable(
      "verificationToken",
      {
        identifier: varchar("identifier", { length: 255 }).notNull(),
        token: varchar("token", { length: 255 }).notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
      },
      (vt) => ({
        compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
      })
    ) satisfies DefaultMySqlVerificationTokenTable)

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
  }
}

export function MySqlDrizzleAdapter(
  client: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase, any>,
  schema?: DefaultMySqlSchema
): Adapter {
  const { usersTable, accountsTable, sessionsTable, verificationTokensTable } =
    defineTables(schema)

  return {
    async createUser(data: AdapterUser) {
      const { id, ...insertData } = data
      const hasDefaultId = getTableColumns(usersTable)["id"]["hasDefault"]

      await client
        .insert(usersTable)
        .values(hasDefaultId ? insertData : { ...insertData, id })

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

type DefaultMyqlColumn<
  T extends {
    data: string | number | Date
    dataType: "string" | "number" | "date"
    notNull: boolean
    columnType: "MySqlVarChar" | "MySqlText" | "MySqlTimestamp" | "MySqlInt"
  },
> = MySqlColumn<{
  name: string
  columnType: T["columnType"]
  data: T["data"]
  driverParam: string | number
  notNull: T["notNull"]
  hasDefault: boolean
  enumValues: any
  dataType: T["dataType"]
  tableName: string
}>

export type DefaultMySqlUsersTable = MySqlTableWithColumns<{
  name: string
  columns: {
    id: DefaultMyqlColumn<{
      data: string
      dataType: "string"
      notNull: true
      columnType: "MySqlVarChar" | "MySqlText"
    }>
    name: DefaultMyqlColumn<{
      data: string
      dataType: "string"
      notNull: boolean
      columnType: "MySqlVarChar" | "MySqlText"
    }>
    email: DefaultMyqlColumn<{
      data: string
      dataType: "string"
      notNull: true
      columnType: "MySqlVarChar" | "MySqlText"
    }>
    emailVerified: DefaultMyqlColumn<{
      data: Date
      dataType: "date"
      notNull: boolean
      columnType: "MySqlTimestamp"
    }>
    image: DefaultMyqlColumn<{
      data: string
      dataType: "string"
      notNull: boolean
      columnType: "MySqlVarChar" | "MySqlText"
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlAccountsTable = MySqlTableWithColumns<{
  name: string
  columns: {
    userId: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    type: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    provider: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
    }>
    refresh_token: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: boolean
    }>
    access_token: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      driverParam: string | number
      notNull: boolean
    }>
    expires_at: DefaultMyqlColumn<{
      dataType: "number"
      columnType: "MySqlInt"
      data: number
      notNull: boolean
    }>
    token_type: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: boolean
    }>
    scope: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: boolean
    }>
    id_token: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: boolean
    }>
    session_state: DefaultMyqlColumn<{
      dataType: "string"
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlSessionsTable = MySqlTableWithColumns<{
  name: string
  columns: {
    sessionToken: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultMyqlColumn<{
      dataType: "date"
      columnType: "MySqlTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlVerificationTokenTable = MySqlTableWithColumns<{
  name: string
  columns: {
    identifier: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    token: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultMyqlColumn<{
      dataType: "date"
      columnType: "MySqlTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "mysql"
  schema: string | undefined
}>

export type DefaultMySqlSchema = {
  usersTable: DefaultMySqlUsersTable
  accountsTable: DefaultMySqlAccountsTable
  sessionsTable?: DefaultMySqlSessionsTable
  verificationTokensTable?: DefaultMySqlVerificationTokenTable
}
