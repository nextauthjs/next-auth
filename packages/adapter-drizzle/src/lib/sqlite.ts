import { eq, and } from "drizzle-orm"
import {
  integer,
  sqliteTable as defaultSqliteTableFn,
  text,
  primaryKey,
  BaseSQLiteDatabase,
  SQLiteTableFn,
} from "drizzle-orm/sqlite-core"

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
    createUser(data) {
      return client
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .get()
    },
    async getUser(data) {
      const result = await Promise.resolve(
        client.select().from(users).where(eq(users.id, data)).get()
      )
      return result ?? null
    },
    async getUserByEmail(data) {
      const result = await Promise.resolve(
        client.select().from(users).where(eq(users.email, data)).get()
      )
      return result ?? null
    },
    createSession(data) {
      return client.insert(sessions).values(data).returning().get()
    },
    async getSessionAndUser(data) {
      const x = await Promise.resolve(
        client
          .select({
            session: sessions,
            user: users,
          })
          .from(sessions)
          .where(eq(sessions.sessionToken, data))
          .innerJoin(users, eq(users.id, sessions.userId))
          .get()
      )
      return x ?? null
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      const result = await Promise.resolve(
        client
          .update(users)
          .set(data)
          .where(eq(users.id, data.id))
          .returning()
          .get()
      )
      return result ?? null
    },
    async updateSession(data) {
      const result = await Promise.resolve(
        client
          .update(sessions)
          .set(data)
          .where(eq(sessions.sessionToken, data.sessionToken))
          .returning()
          .get()
      )
      return result ?? null
    },
    async linkAccount(rawAccount) {
      const updatedAccount = await Promise.resolve(
        client.insert(accounts).values(rawAccount).returning().get()
      )

      const account: AdapterAccount = {
        ...updatedAccount,
        type: updatedAccount.type,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined,
      }

      return account
    },
    async getUserByAccount(account) {
      const x = await Promise.resolve(
        client
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
      )
      return x?.user ?? null
    },
    async deleteSession(sessionToken) {
      const x = await Promise.resolve(
        client
          .delete(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .returning()
          .get()
      )
      return x ?? null
    },
    async createVerificationToken(token) {
      const result = await Promise.resolve(
        client.insert(verificationTokens).values(token).returning().get()
      )
      return result ?? null
    },
    async useVerificationToken(token) {
      try {
        const result = await Promise.resolve(
          client
            .delete(verificationTokens)
            .where(
              and(
                eq(verificationTokens.identifier, token.identifier),
                eq(verificationTokens.token, token.token)
              )
            )
            .returning()
            .get()
        )
        return result ?? null
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    async deleteUser(id) {
      const result = await Promise.resolve(
        client.delete(users).where(eq(users.id, id)).returning().get()
      )
      return result ?? null
    },
    async unlinkAccount(account) {
      await Promise.resolve(
        client
          .delete(accounts)
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider)
            )
          )
          .run()
      )

      return undefined
    },
  }
}
