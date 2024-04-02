import { and, eq } from "drizzle-orm"
import {
  timestamp,
  text,
  primaryKey,
  integer,
  PgDatabase,
  pgTable,
  index,
  PgTableWithColumns,
  QueryResultHKT,
  TableConfig
} from "drizzle-orm/pg-core"

import type { Adapter, AdapterAccount, AdapterUser, AdapterSession, VerificationToken } from "@auth/core/adapters"
import { randomUUID } from "crypto"

export const users = pgTable("users" as string, {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "accounts" as string,
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
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
      userIdIdx: index().on(table.userId),
      compositePk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    }
  }
)

export const sessions = pgTable("sessions" as string, {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => {
  return {
    userIdIdx: index().on(table.userId),
  }
})

export const verificationTokens = pgTable(
  "verificationTokens" as string,
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.identifier, table.token] })
    }
  }
)

export function PostgresDrizzleAdapter(
  client: PgDatabase<QueryResultHKT, any>,
  schema: Partial<DefaultPostgresSchema> = {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }
): Adapter {
  const { usersTable = users, accountsTable = accounts, sessionsTable = sessions, verificationTokensTable = verificationTokens } = schema

  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      return await client
        .insert(usersTable)
        .values(data)
        .returning()
        .then((res) => res[0]) as AdapterUser
    },
    async getUser(userId: string) {
      return await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .then((res) => res.length > 0 ? res[0] : null) as AdapterUser | null
    },
    async getUserByEmail(email: string) {
      return await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .then((res) => res.length > 0 ? res[0] : null) as AdapterUser | null
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      return await client
        .insert(sessionsTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async getSessionAndUser(sessionToken: string) {
      return await client
        .select({
          session: sessionsTable,
          user: usersTable,
        })
        .from(sessionsTable)
        .where(eq(sessionsTable.sessionToken, sessionToken))
        .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
        .then((res) => res.length > 0 ? res[0] : null) as { session: AdapterSession; user: AdapterUser } | null
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const result =  await client
        .update(usersTable)
        .set(data)
        .where(eq(usersTable.id, data.id))
        .returning()
        .then((res) => res[0]) as AdapterUser | undefined

      if (!result) {
        throw new Error("No user found.")
      }

      return result
    },
    async updateSession(data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      return await client
        .update(sessionsTable)
        .set(data)
        .where(eq(sessionsTable.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    async linkAccount(data: AdapterAccount) {
      await client.insert(accountsTable).values(data)
    },
    async getUserByAccount(account: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const result = await client.select({
        account: accountsTable,
        user: usersTable,
      }).from(accountsTable)
        .innerJoin(usersTable, eq(accountsTable.userId, usersTable.id)).where(
          and(
            eq(accountsTable.provider, account.provider),
            eq(accountsTable.providerAccountId, account.providerAccountId),
          )
        ).then((res) => res[0] as { account: AdapterAccount, user: AdapterUser } | undefined)

      return result?.user ?? null
    },
    async deleteSession(sessionToken: string) {
      await client.delete(sessionsTable).where(eq(sessionsTable.sessionToken, sessionToken))
    },
    async createVerificationToken(data: VerificationToken) {
      return await client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async useVerificationToken(params: {
      identifier: string
      token: string
    }) {
      return await client
        .delete(verificationTokensTable)
        .where(
          and(
            eq(verificationTokensTable.identifier, params.identifier),
            eq(verificationTokensTable.token, params.token)
          )
        )
        .returning()
        .then((res) => res.length > 0 ? res[0] : null)
    },
    async deleteUser(id: string) {
      await client.delete(usersTable).where(eq(usersTable.id, id))
    },
    async unlinkAccount(params: Pick<AdapterAccount, "provider" | "providerAccountId">) {
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

export type PostgresTableFn<T extends TableConfig> = PgTableWithColumns<{
  name: T['name'],
  columns: T['columns'],
  dialect: T['dialect'],
  schema: string | undefined
}>

export type DefaultPostgresSchema = {
  usersTable: PostgresTableFn<typeof users['_']['config']>,
  accountsTable: PostgresTableFn<typeof accounts['_']['config']>,
  sessionsTable: PostgresTableFn<typeof sessions['_']['config']>,
  verificationTokensTable: PostgresTableFn<typeof verificationTokens['_']['config']>,
}

export function getDefaultPostgresSchema(): DefaultPostgresSchema {
  return {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }
}
