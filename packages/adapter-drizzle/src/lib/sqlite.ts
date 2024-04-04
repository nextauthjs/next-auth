import { eq, and } from "drizzle-orm"
import {
  integer,
  text,
  primaryKey,
  BaseSQLiteDatabase,
  sqliteTable,
  index,
  TableConfig,
  SQLiteTableWithColumns
} from "drizzle-orm/sqlite-core"

import type { Adapter, AdapterAccount, AdapterUser, AdapterSession, VerificationToken } from "@auth/core/adapters"
import { randomUUID } from "crypto"

export const sqliteUsersTable = sqliteTable("users" as string, {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
 })
 
 export const sqliteAccountsTable = sqliteTable(
  "accounts" as string,
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
    userIdIdx: index('Account_userId_index').on(account.userId),
    compositePk: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
  })
 )
 
 export const sqliteSessionsTable = sqliteTable("sessions" as string, {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
 sessionToken: text("sessionToken").notNull().unique(),
 userId: text("userId")
   .notNull()
   .references(() => sqliteUsersTable.id, { onDelete: "cascade" }),
 expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 }, (table) => ({
    userIdIdx: index('Session_userId_index').on(table.userId),
 }))
 
 export const sqliteVerificationTokensTable = sqliteTable(
 "verificationTokens" as string,
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
  client: BaseSQLiteDatabase<'sync' | 'async', any, any>,
  schema: DefaultSQLiteSchema = {
    usersTable: sqliteUsersTable,
    accountsTable: sqliteAccountsTable,
    sessionsTable: sqliteSessionsTable,
    verificationTokensTable: sqliteVerificationTokensTable
  }
): Adapter {
  const { usersTable, accountsTable, sessionsTable, verificationTokensTable } = schema

  return {
    async createUser(data: Omit<AdapterUser, "id">) {
      return await client
        .insert(usersTable)
        .values(data)
        .returning()
        .get() as AdapterUser
    },
    async getUser(userId: string) {
      const result = await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .get() as AdapterUser | undefined
  
      return result ?? null
    },
    async getUserByEmail(email: string) {
      const result = await client
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .get() as AdapterUser | undefined
    
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
        .get() as { session: AdapterSession; user: AdapterUser } | undefined

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
        .get() as AdapterUser | undefined

        if(!result) {
          throw new Error("User not found.")
        }
      
        return result
    },
    async updateSession(data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
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
        )
        .get() as { account: AdapterAccount; user: AdapterUser } | undefined

      return result?.user ?? null
    },
    async deleteSession(sessionToken: string) {
      await client.delete(sessionsTable).where(eq(sessionsTable.sessionToken, sessionToken)).run()
    },
    async createVerificationToken(data: VerificationToken) {
      return await client
        .insert(verificationTokensTable)
        .values(data)
        .returning()
        .get()
    },
    async useVerificationToken(params: {
      identifier: string
      token: string
    }) {
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
    async unlinkAccount(params: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      await client
        .delete(accountsTable)
        .where(
          and(
            eq(accountsTable.provider, params.provider),
            eq(accountsTable.providerAccountId, params.providerAccountId),
          )
        )
        .run()
    },
  }
}

export type SQLiteTableFn<T extends TableConfig> = SQLiteTableWithColumns<{
  name: T['name'],
  columns: T['columns'],
  dialect: T['dialect'],
  schema: string | undefined
}>

export type DefaultSQLiteSchema = {
  usersTable: SQLiteTableFn<typeof sqliteUsersTable['_']['config']>,
  accountsTable: SQLiteTableFn<typeof sqliteAccountsTable['_']['config']>,
  sessionsTable: SQLiteTableFn<typeof sqliteSessionsTable['_']['config']>,
  verificationTokensTable: SQLiteTableFn<typeof sqliteVerificationTokensTable['_']['config']>,
}
