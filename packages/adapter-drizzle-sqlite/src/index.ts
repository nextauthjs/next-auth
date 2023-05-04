
/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://github.com/drizzle-team/drizzle-orm">Drizzle ORM</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://github.com/drizzle-team/drizzle-orm">
 *   <img style={{display: "block"}} src="https://pbs.twimg.com/profile_images/1598308842391179266/CtXrfLnk_400x400.jpg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth drizzle-orm @next-auth/drizzle-adapter
 * npm install drizzle-kit --save-dev
 * ```
 *
 * @module @next-auth/drizzle-adapter
 */
import { db, accounts, users, sessions, verificationTokens } from './schema'
import { and, eq } from 'drizzle-orm'
import type { Adapter } from "next-auth/adapters"

/**
 * ## Setup
 *
 * Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object:
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@next-auth/drizzle-adapter"
 * import { db } from "./db-schema"
 *
 * export default NextAuth({
 *   adapter: DrizzleAdapter(db),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ## Advanced usage
 *
 * ### Create the Drizzle schema from scratch
 *
 * You'll need to create a database schema that includes the minimal schema for a `next-auth` adapter.
 * Be sure to use the Drizzle driver version that you're using for your project.
 *
 * > This schema is adapted for use in Drizzle and based upon our main [schema](https://authjs.dev/reference/adapters#models)
 *
 *
 * ```json title="db-schema.ts"
 *
 * import { integer, pgTable, text, primaryKey } from 'drizzle-orm/pg-core';
 * import { drizzle } from 'drizzle-orm/node-postgres';
 * import { migrate } from 'drizzle-orm/node-postgres/migrator';
 * import { Pool } from 'pg'
 * import { ProviderType } from 'next-auth/providers';
 *
 * export const users = pgTable('users', {
 * id: text('id').notNull().primaryKey(),
 * name: text('name'),
 * email: text("email").notNull(),
 * emailVerified: integer("emailVerified"),
 * image: text("image"),
 * });
 *
 * export const accounts = pgTable("accounts", {
 *  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
 *  type: text("type").$type<ProviderType>().notNull(),
 *  provider: text("provider").notNull(),
 *  providerAccountId: text("providerAccountId").notNull(),
 *  refresh_token: text("refresh_token"),
 *  access_token: text("access_token"),
 *  expires_at: integer("expires_at"),
 *  token_type: text("token_type"),
 *  scope: text("scope"),
 *  id_token: text("id_token"),
 *  session_state: text("session_state"),
 * }, (account) => ({
 *   _: primaryKey(account.provider, account.providerAccountId)
 * }))
 *
 * export const sessions = pgTable("sessions", {
 *  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
 *  sessionToken: text("sessionToken").notNull().primaryKey(),
 *  expires: integer("expires").notNull(),
 * })
 *
 * export const verificationTokens = pgTable("verificationToken", {
 *  identifier: text("identifier").notNull(),
 *  token: text("token").notNull(),
 *  expires: integer("expires").notNull()
 * }, (vt) => ({
 *   _: primaryKey(vt.identifier, vt.token)
 * }))
 *
 * const pool = new Pool({
 *   connectionString: "YOUR_CONNECTION_STRING"
 * });
 *
 * export const db = drizzle(pool);
 *
 * migrate(db, { migrationsFolder: "./drizzle" })
 *
 * ```
 *
 **/
export function DrizzleAdapterSQLite(client: typeof db): Adapter {
  return {
    createUser: (data) => {
      return client
        .insert(users)
        .values({ ...data, id: "123" })
        .returning()
        .get()
    },
    getUser: (data) => {
      return client
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get() ?? null
    },
    getUserByEmail: (data) => {
      return client
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get() ?? null
    },
    createSession: (data) => {
      return client
        .insert(sessions)
        .values(data)
        .returning()
        .get()
    },
    getSessionAndUser: (data) => {
      return client.select({
        session: sessions,
        user: users
      })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .get() ?? null
    },
    updateUser: (data) => {
      if (!data.id) {
        throw new Error("No user id.")
      }

      return client
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get()
    },
    updateSession: (data) => {
      return client
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()
    },
    linkAccount: (rawAccount) => {
      const updatedAccount = client
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get()

      const account: ReturnType<Adapter["linkAccount"]> = {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined
      }

      return account
    },
    getUserByAccount: (account) => {
      return client.select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        name: users.name
      })
        .from(users)
        .innerJoin(accounts, (
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        ))
        .get() ?? null
    }
    ,
    deleteSession: (sessionToken) => {
      return client
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get() ?? null
    },
    createVerificationToken: (token) => {
      return client
        .insert(verificationTokens)
        .values(token)
        .returning()
        .get()
    },
    useVerificationToken: (token) => {
      try {
        return client
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .get() ?? null

      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: (id) => {
      return client
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .get()
    },
    unlinkAccount: (account) => {
      client.delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          )
        )
        .run()

      return undefined
    }
  }
}
