import { and, eq } from "drizzle-orm"
import {
  timestamp,
  pgTable as defaultPgTableFn,
  text,
  primaryKey,
  integer,
  PgTableFn,
  PgDatabase,
} from "drizzle-orm/pg-core"

import type { Adapter, AdapterAccount } from "@auth/core/adapters"
import { stripUndefined } from "./utils.js"

export function createTables(pgTable: PgTableFn) {
  const users = pgTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  })

  const accounts = pgTable(
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

  const sessions = pgTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  })

  const verificationTokens = pgTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => ({
      compoundKey: primaryKey(vt.identifier, vt.token),
    })
  )

  return { users, accounts, sessions, verificationTokens }
}

export type DefaultSchema = ReturnType<typeof createTables>

export function pgDrizzleAdapter(
  client: InstanceType<typeof PgDatabase>,
  tableFn = defaultPgTableFn
): Adapter {
  const { users, accounts, sessions, verificationTokens } =
    createTables(tableFn)

  return {
    async createUser(data) {
      return await client
        .insert(users)
        .values({ ...data, id: crypto.randomUUID() })
        .returning()
        .then((res) => res[0] ?? null)
    },
    async getUser(data) {
      return await client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .then((res) => res[0] ?? null)
    },
    async getUserByEmail(data) {
      return await client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .then((res) => res[0] ?? null)
    },
    async createSession(data) {
      return await client
        .insert(sessions)
        .values(data)
        .returning()
        .then((res) => res[0])
    },
    async getSessionAndUser(data) {
      return await client
        .select({
          session: sessions,
          user: users,
        })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .then((res) => res[0] ?? null)
    },
    async updateUser(data) {
      if (!data.id) {
        throw new Error("No user id.")
      }

      return await client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .then((res) => res[0])
    },
    async updateSession(data) {
      return await client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .then((res) => res[0])
    },
    async linkAccount(rawAccount) {
      return stripUndefined(
        await client
          .insert(accounts)
          .values(rawAccount)
          .returning()
          .then((res) => res[0])
      )
    },
    async getUserByAccount(account) {
      const dbAccount =
        (await client
          .select()
          .from(accounts)
          .where(
            and(
              eq(accounts.providerAccountId, account.providerAccountId),
              eq(accounts.provider, account.provider)
            )
          )
          .leftJoin(users, eq(accounts.userId, users.id))
          .then((res) => res[0])) ?? null

      return dbAccount?.user ?? null
    },
    async deleteSession(sessionToken) {
      const session = await client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .then((res) => res[0] ?? null)

      return session
    },
    async createVerificationToken(token) {
      return await client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .then((res) => res[0])
    },
    async useVerificationToken(token) {
      try {
        return await client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .then((res) => res[0] ?? null)
      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    async deleteUser(id) {
      await client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .then((res) => res[0] ?? null)
    },
    async unlinkAccount(account) {
      const { type, provider, providerAccountId, userId } = await client
        .delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        )
        .returning()
        .then((res) => res[0] ?? null)

      return { provider, type, providerAccountId, userId }
    },
  }
}
