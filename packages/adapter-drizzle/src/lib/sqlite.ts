import { InferInsertModel, and, eq, getTableColumns } from "drizzle-orm"
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
  AdapterAccountType,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

export function defineTables(
  schema: Partial<DefaultSQLiteSchema> = {}
): Required<DefaultSQLiteSchema> {
  const usersTable =
    schema.usersTable ??
    (sqliteTable("user", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name"),
      email: text("email").notNull(),
      emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
      image: text("image"),
    }) satisfies DefaultSQLiteUsersTable)

  const accountsTable =
    schema.accountsTable ??
    (sqliteTable(
      "account",
      {
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
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
    ) satisfies DefaultSQLiteAccountsTable)

  const sessionsTable =
    schema.sessionsTable ??
    (sqliteTable("session", {
      sessionToken: text("sessionToken").primaryKey(),
      userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    }) satisfies DefaultSQLiteSessionsTable)

  const verificationTokensTable =
    schema.verificationTokensTable ??
    (sqliteTable(
      "verificationToken",
      {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
      },
      (vt) => ({
        compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
      })
    ) satisfies DefaultSQLiteVerificationTokenTable)

  const authenticatorsTable =
    schema.authenticatorsTable ??
    (sqliteTable("authenticator", {
      id: text("id").notNull().primaryKey(),
      credentialID: text("credentialID").notNull().unique(),
      userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      providerAccountId: text("providerAccountId").notNull(),
      credentialPublicKey: text("credentialPublicKey").notNull(),
      counter: integer("counter").notNull(),
      credentialDeviceType: text("credentialDeviceType").notNull(),
      credentialBackedUp: integer("credentialBackedUp", {
        mode: "boolean",
      }).notNull(),
      transports: text("transports"),
    }) satisfies DefaultSQLiteAuthenticatorTable)

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  }
}

export function SQLiteDrizzleAdapter(
  client: BaseSQLiteDatabase<"sync" | "async", any, any>,
  schema?: DefaultSQLiteSchema
): Adapter {
  const {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  } = defineTables(schema)

  return {
    async createUser(data: AdapterUser) {
      const { id, ...insertData } = data
      const hasDefaultId = getTableColumns(usersTable)["id"]["hasDefault"]

      return client
        .insert(usersTable)
        .values(hasDefaultId ? insertData : { ...insertData, id })
        .returning()
        .get()
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
    async createAuthenticator(data: AdapterAuthenticator) {
      const user = await client
        .insert(authenticatorsTable)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .then((res) => (res[0]) ?? null)

      return user
    },
    async getAuthenticator(credentialID: string) {
      const authenticator = await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res) => (res.length ? (res[0]) : null))
      return authenticator ? authenticator : null
    },
    async listAuthenticatorsByUserId(userId: string) {
      return await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))
        .then((res) => res.map())
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      return await client
        .update(authenticatorsTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .returning()
        .then((res) => (res[0]) ?? null)
    },
  }
}

type BaseAuthenticator = InferInsertModel<
  ReturnType<typeof defineTables>["authenticatorsTable"]
>
export type DrizzleAuthenticator = BaseAuthenticator &
  Required<
    Pick<
      BaseAuthenticator,
      | "userId"
      | "providerAccountId"
      | "counter"
      | "credentialBackedUp"
      | "credentialID"
      | "credentialPublicKey"
      | "credentialDeviceType"
    >
  >

function (
  authenticator: DrizzleAuthenticator
): AdapterAuthenticator {
  const { transports, id, ...other } = authenticator

  return {
    ...other,
    transports: transports || undefined,
  }
}

type DefaultSQLiteColumn<
  T extends {
    data: string | boolean | number | Date
    dataType: "string" | "boolean" | "number" | "date"
    notNull: boolean
    columnType:
      | "SQLiteText"
      | "SQLiteBoolean"
      | "SQLiteTimestamp"
      | "SQLiteInteger"
  },
> = SQLiteColumn<{
  name: string
  columnType: T["columnType"]
  data: T["data"]
  driverParam: string | number | boolean
  notNull: T["notNull"]
  hasDefault: boolean
  enumValues: any
  dataType: T["dataType"]
  tableName: string
}>

export type DefaultSQLiteUsersTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    id: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    name: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: boolean
      dataType: "string"
    }>
    email: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    emailVerified: DefaultSQLiteColumn<{
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      notNull: boolean
    }>
    image: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteAccountsTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    userId: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    type: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    provider: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: true
    }>
    refresh_token: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
    access_token: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
    expires_at: DefaultSQLiteColumn<{
      dataType: "number"
      columnType: "SQLiteInteger"
      data: number
      notNull: boolean
    }>
    token_type: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
    scope: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
    id_token: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
    session_state: DefaultSQLiteColumn<{
      dataType: "string"
      columnType: "SQLiteText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteSessionsTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    sessionToken: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultSQLiteColumn<{
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteVerificationTokenTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    identifier: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    token: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultSQLiteColumn<{
      dataType: "date"
      columnType: "SQLiteTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteAuthenticatorTable = SQLiteTableWithColumns<{
  name: string
  columns: {
    id: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialID: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialPublicKey: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    counter: DefaultSQLiteColumn<{
      columnType: "SQLiteInteger"
      data: number
      notNull: true
      dataType: "number"
    }>
    credentialDeviceType: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialBackedUp: DefaultSQLiteColumn<{
      columnType: "SQLiteBoolean"
      data: boolean
      notNull: true
      dataType: "boolean"
    }>
    transports: DefaultSQLiteColumn<{
      columnType: "SQLiteText"
      data: string
      notNull: false
      dataType: "string"
    }>
  }
  dialect: "sqlite"
  schema: string | undefined
}>

export type DefaultSQLiteSchema = {
  usersTable: DefaultSQLiteUsersTable
  accountsTable: DefaultSQLiteAccountsTable
  sessionsTable?: DefaultSQLiteSessionsTable
  verificationTokensTable?: DefaultSQLiteVerificationTokenTable
  authenticatorsTable?: DefaultSQLiteAuthenticatorTable
}
