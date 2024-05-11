import { InferInsertModel, and, eq, getTableColumns } from "drizzle-orm"
import {
  MySqlColumn,
  MySqlDatabase,
  boolean,
  int,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
  index,
  QueryResultHKT,
  PreparedQueryHKTBase,
  TableConfig,
  MySqlTableWithColumns,
} from "drizzle-orm/mysql-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterAccountType,
  AdapterSession,
  AdapterUser,
  VerificationToken,
  AdapterAuthenticator,
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
      (verficationToken) => ({
        compositePk: primaryKey({
          columns: [verficationToken.identifier, verficationToken.token],
        }),
      })
    ) satisfies DefaultMySqlVerificationTokenTable)

  const authenticatorsTable =
    schema.authenticatorsTable ??
    (mysqlTable(
      "authenticator",
      {
        credentialID: varchar("credentialID", { length: 255 })
          .notNull()
          .unique(),
        userId: varchar("userId", { length: 255 })
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        providerAccountId: varchar("providerAccountId", {
          length: 255,
        }).notNull(),
        credentialPublicKey: varchar("credentialPublicKey", {
          length: 255,
        }).notNull(),
        counter: int("counter").notNull(),
        credentialDeviceType: varchar("credentialDeviceType", {
          length: 255,
        }).notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: varchar("transports", { length: 255 }),
      },
      (authenticator) => ({
        compositePk: primaryKey({
          columns: [authenticator.userId, authenticator.credentialID],
        }),
      })
    ) satisfies DefaultMySqlAuthenticatorTable)

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  }
}

export function MySqlDrizzleAdapter(
  client: MySqlDatabase<QueryResultHKT, PreparedQueryHKTBase, any>,
  schema?: DefaultMySqlSchema
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
    async createAuthenticator(data: AdapterAuthenticator) {
      await client.insert(authenticatorsTable).values(data)

      return await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, data.credentialID))
        .then((res) => res[0] ?? null)
    },
    async getAuthenticator(credentialID: string) {
      return await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res) => res[0] ?? null)
    },
    async listAuthenticatorsByUserId(userId: string) {
      return await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))
        .then((res) => res)
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      await client
        .update(authenticatorsTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorsTable.credentialID, credentialID))

      return await client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res) => res[0] ?? null)
    },
  }
}

type DefaultMyqlColumn<
  T extends {
    data: string | number | boolean | Date
    dataType: "string" | "number" | "boolean" | "date"
    notNull: boolean
    columnType:
      | "MySqlVarChar"
      | "MySqlText"
      | "MySqlBoolean"
      | "MySqlTimestamp"
      | "MySqlInt"
  },
> = MySqlColumn<{
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

export type DefaultMySqlAuthenticatorTable = MySqlTableWithColumns<{
  name: string
  columns: {
    credentialID: DefaultMyqlColumn<{
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
    providerAccountId: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialPublicKey: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    counter: DefaultMyqlColumn<{
      columnType: "MySqlInt"
      data: number
      notNull: true
      dataType: "number"
    }>
    credentialDeviceType: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialBackedUp: DefaultMyqlColumn<{
      columnType: "MySqlBoolean"
      data: boolean
      notNull: true
      dataType: "boolean"
    }>
    transports: DefaultMyqlColumn<{
      columnType: "MySqlVarChar" | "MySqlText"
      data: string
      notNull: false
      dataType: "string"
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
  authenticatorsTable?: DefaultMySqlAuthenticatorTable
}
