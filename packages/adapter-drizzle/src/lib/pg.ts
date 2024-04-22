import { and, eq } from "drizzle-orm"
import {
  PgColumn,
  PgDatabase,
  PgTableWithColumns,
  QueryResultHKT,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp
} from "drizzle-orm/pg-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

import { randomUUID } from "crypto"

export const postgresUsersTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const postgresAccountsTable = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => postgresUsersTable.id, { onDelete: "cascade" }),
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
  (table) => {
    return {
      compositePk: primaryKey({
        columns: [table.provider, table.providerAccountId],
      }),
    }
  }
)

export const postgresSessionsTable = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => postgresUsersTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  }
)

export const postgresVerificationTokensTable = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.identifier, table.token] }),
    }
  }
)

export function PostgresDrizzleAdapter(
  client: PgDatabase<QueryResultHKT, any>,
  schema: DefaultPostgresSchema = {
    usersTable: postgresUsersTable,
    accountsTable: postgresAccountsTable,
    sessionsTable: postgresSessionsTable,
    verificationTokensTable: postgresVerificationTokensTable,
  }
): Adapter {
  const { usersTable, accountsTable, sessionsTable, verificationTokensTable } =
    schema

  return {
    async createUser(data: AdapterUser) {
      return client
        .insert(usersTable)
        .values(data)
        .returning()
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
      return client
        .insert(sessionsTable)
        .values(data)
        .returning()
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

      const [result] = await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning()

      if (!result) {
        throw new Error("No user found.")
      }

      return result
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      return client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .returning()
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
      return client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      return client
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token)
          )
        )
        .returning()
        .then((res) => (res.length > 0 ? res[0] : null))
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

export type DefaultPostgresUsersTable = PgTableWithColumns<{
  name: string
  columns: {
    id: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number;
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    name: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    email: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    emailVerified: PgColumn<{
      name: string
      tableName: string
      dataType: 'date'
      columnType: 'PgTimestamp'
      data: Date
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    image: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: 'pg'
  schema: string | undefined
}>

export type DefaultPostgresAccountsTable = PgTableWithColumns<{
  name: string
  columns: {
    userId: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number;
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    type: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    provider: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    providerAccountId: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    refresh_token: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    access_token: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    expires_at: PgColumn<{
      name: string
      tableName: string
      dataType: 'number'
      columnType: 'PgInteger'
      data: number
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    token_type: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    scope: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    id_token: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
    session_state: PgColumn<{
      name: string
      tableName: string
      dataType: 'string'
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: boolean
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: 'pg'
  schema: string | undefined
}>

export type DefaultPostgresSessionsTable = PgTableWithColumns<{
  name: string
  columns: {
    sessionToken: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    userId: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    expires: PgColumn<{
      name: string
      tableName: string
      dataType: 'date'
      columnType: 'PgTimestamp'
      data: Date
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: 'pg'
  schema: string | undefined
}>

export type DefaultPostgresVerificationTokenTable = PgTableWithColumns<{
  name: string
  columns: {
    identifier: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    token: PgColumn<{
      name: string
      columnType: 'PgVarchar' | 'PgText'
      data: string
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      dataType: 'string'
      tableName: string
    }>
    expires: PgColumn<{
      name: string
      tableName: string
      dataType: 'date'
      columnType: 'PgTimestamp'
      data: Date
      driverParam: string | number
      notNull: true
      hasDefault: boolean
      enumValues: any
      baseColumn: never
    }>
  }
  dialect: 'pg'
  schema: string | undefined
}>

export type DefaultPostgresSchema = {
  usersTable: DefaultPostgresUsersTable
  accountsTable: DefaultPostgresAccountsTable
  sessionsTable: DefaultPostgresSessionsTable
  verificationTokensTable: DefaultPostgresVerificationTokenTable
}
