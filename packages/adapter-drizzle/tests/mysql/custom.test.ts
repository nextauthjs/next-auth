import { mysqlTable, timestamp, text, int, primaryKey, MySqlTextColumnType } from "drizzle-orm/mysql-core"
import { runBasicTests } from "../../../adapter-test"
import { DrizzleAdapter } from "../../src"
import { users, sessions, accounts, verificationTokens, db } from "../../src/mysql"
import { eq, and } from "drizzle-orm"
import type { AdapterAccount } from "@auth/core/adapters"

export const customUsersTable = mysqlTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: text("image"),
  phone: text("phone")
})

export const customAccountsTable = mysqlTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

runBasicTests({
  adapter: DrizzleAdapter(
    db,
    {
      // TODO: MySQLText doesn't fit with text?
      users: customUsersTable,
      accounts: customAccountsTable
    }
  ),
  db: {
    connect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
      ])
    },
    user: async (id) => {
      const user = await db.select().from(users).where(eq(users.id, id)).then(res => res[0] ?? null)
      return user
    },
    session: async (sessionToken) => {
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken)).then(res => res[0] ?? null)

      return session
    },
    account: (provider_providerAccountId) => {
      const account = db
        .select()
        .from(accounts)
        .where(
          eq(
            accounts.providerAccountId,
            provider_providerAccountId.providerAccountId
          )
        ).then(res => res[0] ?? null)
      return account
    },
    verificationToken: (identifier_token) =>
      db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.token, identifier_token.token),
            eq(verificationTokens.identifier, identifier_token.identifier)
          )
        ).then(res => res[0]) ?? null,
  },
})
