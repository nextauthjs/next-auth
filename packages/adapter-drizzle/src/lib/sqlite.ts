import { eq, and } from "drizzle-orm"
import {
  integer,
  sqliteTable as defaultSqliteTableFn,
  text,
  primaryKey,
  BaseSQLiteDatabase,
  SQLiteTableFn,
} from "drizzle-orm/sqlite-core"
import { stripUndefined } from "./utils.js"

import type { Adapter, AdapterAccount } from "@auth/core/adapters"

export function createTables(sqliteTable: SQLiteTableFn) {
  const users = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
  })

  const accounts = sqliteTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount["type"]>().notNull(),
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
      compoundKey: primaryKey(account.provider, account.providerAccountId),
    })
  )

  const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  })

  const verificationTokens = sqliteTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (vt) => ({
      compoundKey: primaryKey(vt.identifier, vt.token),
    })
  )

  return { users, accounts, sessions, verificationTokens }
}

export type DefaultSchema = ReturnType<typeof createTables>

export function SQLiteDrizzleAdapter(
  client: InstanceType<typeof BaseSQLiteDatabase>,
  tableFn = defaultSqliteTableFn
): Adapter {
  const { users, accounts, sessions, verificationTokens } =
    createTables(tableFn)

  return {
    async createUser(data) {
      return await client
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .get()
    },
    async getUser(data) {
      const result = await client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get()
      return result ?? null
    },
    async getUserByEmail(data) {
      const result = await client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get()
      return result ?? null
    },
    createSession(data) {
      return client.insert(sessions).values(data).returning().get()
    },
    async getSessionAndUser(data) {
      const result = await client
        .select({ session: sessions, user: users })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .get()
      return result ?? null
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const result = await client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get()
      return result ?? null
    },
    async updateSession(data) {
      const result = await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()
      return result ?? null
    },
    async linkAccount(rawAccount) {
      return stripUndefined(
        await client.insert(accounts).values(rawAccount).returning().get()
      )
    },
    async getUserByAccount(account) {
      const results = await client
        .select()
        .from(accounts)
        .leftJoin(users, eq(users.id, accounts.userId))
        .where(
          and(
            eq(accounts.provider, account.provider),
            eq(accounts.providerAccountId, account.providerAccountId)
          )
        )
        .get()

      if (!results) {
        return null
      }
      return Promise.resolve(results).then((results) => results.user)
    },
    async deleteSession(sessionToken) {
      const result = await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get()
      return result ?? null
    },
    async createVerificationToken(token) {
      const result = await client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .get()
      return result ?? null
    },
    async useVerificationToken(token) {
      try {
        const result = await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .get()
        return result ?? null
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    async deleteUser(id) {
      const result = await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .get()
      return result ?? null
    },
    async unlinkAccount(account) {
      await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .run()
    },
  }
}
