import { GeneratedColumnConfig, and, eq, getTableColumns } from "drizzle-orm"
import {
  PgColumn,
  PgDatabase,
  PgQueryResultHKT,
  PgTableWithColumns,
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

import type {
  Adapter,
  AdapterAccount,
  AdapterAccountType,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import { Awaitable } from "@auth/core/types"

export function defineTables(
  schema: Partial<DefaultPostgresSchema> = {}
): Required<DefaultPostgresSchema> {
  const usersTable =
    schema.usersTable ??
    (pgTable("user", {
      id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
      name: text("name"),
      email: text("email").unique(),
      emailVerified: timestamp("emailVerified", { mode: "date" }),
      image: text("image"),
    }) satisfies DefaultPostgresUsersTable)

  const accountsTable =
    schema.accountsTable ??
    (pgTable(
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
    ) satisfies DefaultPostgresAccountsTable)

  const sessionsTable =
    schema.sessionsTable ??
    (pgTable("session", {
      sessionToken: text("sessionToken").primaryKey(),
      userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    }) satisfies DefaultPostgresSessionsTable)

  const verificationTokensTable =
    schema.verificationTokensTable ??
    (pgTable(
      "verificationToken",
      {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
      },
      (verficationToken) => ({
        compositePk: primaryKey({
          columns: [verficationToken.identifier, verficationToken.token],
        }),
      })
    ) satisfies DefaultPostgresVerificationTokenTable)

  const authenticatorsTable =
    schema.authenticatorsTable ??
    (pgTable(
      "authenticator",
      {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
          .notNull()
          .references(() => usersTable.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
      },
      (authenticator) => ({
        compositePK: primaryKey({
          columns: [authenticator.userId, authenticator.credentialID],
        }),
      })
    ) satisfies DefaultPostgresAuthenticatorTable)

  return {
    usersTable,
    accountsTable,
    sessionsTable,
    verificationTokensTable,
    authenticatorsTable,
  }
}

export function PostgresDrizzleAdapter(
  client: PgDatabase<PgQueryResultHKT, any>,
  schema?: DefaultPostgresSchema
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
        .then((res) => res[0]) as Awaitable<AdapterUser>
    },
    async getUser(userId: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then((res) =>
          res.length > 0 ? res[0] : null
        ) as Awaitable<AdapterUser | null>
    },
    async getUserByEmail(email: string) {
      return client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then((res) =>
          res.length > 0 ? res[0] : null
        ) as Awaitable<AdapterUser | null>
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
        .then((res) => (res.length > 0 ? res[0] : null)) as Awaitable<{
        session: AdapterSession
        user: AdapterUser
      } | null>
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

      return result as Awaitable<AdapterUser>
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

      const user = result?.user ?? null
      return user as Awaitable<AdapterUser | null>
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
    async getAccount(providerAccountId: string, provider: string) {
      return client
        .select()
        .from(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, provider),
            eq(accountsTable.providerAccountId, providerAccountId)
          )
        )
        .then((res) => res[0] ?? null) as Promise<AdapterAccount | null>
    },
    async createAuthenticator(data: AdapterAuthenticator) {
      return client
        .insert(authenticatorsTable)
        .values(data)
        .returning()
        .then((res) => res[0] ?? null) as Awaitable<AdapterAuthenticator>
    },
    async getAuthenticator(credentialID: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .then((res) => res[0] ?? null) as Awaitable<AdapterAuthenticator | null>
    },
    async listAuthenticatorsByUserId(userId: string) {
      return client
        .select()
        .from(authenticatorsTable)
        .where(eq(authenticatorsTable.userId, userId))
        .then((res) => res) as Awaitable<AdapterAuthenticator[]>
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await client
        .update(authenticatorsTable)
        .set({ counter: newCounter })
        .where(eq(authenticatorsTable.credentialID, credentialID))
        .returning()
        .then((res) => res[0])

      if (!authenticator) throw new Error("Authenticator not found.")

      return authenticator as Awaitable<AdapterAuthenticator>
    },
  }
}

type DefaultPostgresColumn<
  T extends {
    data: string | number | boolean | Date
    dataType: "string" | "number" | "boolean" | "date"
    notNull: boolean
    isPrimaryKey?: boolean
    columnType:
      | "PgVarchar"
      | "PgText"
      | "PgBoolean"
      | "PgTimestamp"
      | "PgInteger"
      | "PgUUID"
  },
> = PgColumn<{
  name: string
  isAutoincrement: boolean
  isPrimaryKey: T["isPrimaryKey"] extends true ? true : false
  hasRuntimeDefault: boolean
  generated: GeneratedColumnConfig<T["data"]> | undefined
  columnType: T["columnType"]
  data: T["data"]
  driverParam: string | number | boolean
  notNull: T["notNull"]
  hasDefault: boolean
  enumValues: any
  dataType: T["dataType"]
  tableName: string
}>

export type DefaultPostgresUsersTable = PgTableWithColumns<{
  name: string
  columns: {
    id: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      isPrimaryKey: true
      data: string
      notNull: true
      dataType: "string"
    }>
    name: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
      dataType: "string"
    }>
    email: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
      dataType: "string"
    }>
    emailVerified: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: boolean
    }>
    image: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresAccountsTable = PgTableWithColumns<{
  name: string
  columns: {
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    type: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    provider: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
    }>
    refresh_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    access_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    expires_at: DefaultPostgresColumn<{
      dataType: "number"
      columnType: "PgInteger"
      data: number
      notNull: boolean
    }>
    token_type: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    scope: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    id_token: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
    session_state: DefaultPostgresColumn<{
      dataType: "string"
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: boolean
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresSessionsTable = PgTableWithColumns<{
  name: string
  columns: {
    sessionToken: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      isPrimaryKey: true
      notNull: true
      dataType: "string"
    }>
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresVerificationTokenTable = PgTableWithColumns<{
  name: string
  columns: {
    identifier: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    token: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    expires: DefaultPostgresColumn<{
      dataType: "date"
      columnType: "PgTimestamp"
      data: Date
      notNull: true
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresAuthenticatorTable = PgTableWithColumns<{
  name: string
  columns: {
    credentialID: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    userId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText" | "PgUUID"
      data: string
      notNull: true
      dataType: "string"
    }>
    providerAccountId: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialPublicKey: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    counter: DefaultPostgresColumn<{
      columnType: "PgInteger"
      data: number
      notNull: true
      dataType: "number"
    }>
    credentialDeviceType: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: true
      dataType: "string"
    }>
    credentialBackedUp: DefaultPostgresColumn<{
      columnType: "PgBoolean"
      data: boolean
      notNull: true
      dataType: "boolean"
    }>
    transports: DefaultPostgresColumn<{
      columnType: "PgVarchar" | "PgText"
      data: string
      notNull: false
      dataType: "string"
    }>
  }
  dialect: "pg"
  schema: string | undefined
}>

export type DefaultPostgresSchema = {
  usersTable: DefaultPostgresUsersTable
  accountsTable: DefaultPostgresAccountsTable
  sessionsTable?: DefaultPostgresSessionsTable
  verificationTokensTable?: DefaultPostgresVerificationTokenTable
  authenticatorsTable?: DefaultPostgresAuthenticatorTable
}
