import { mysqlTable, varchar, timestamp, text, int, primaryKey, MySqlTextColumnType } from "drizzle-orm/mysql-core"
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
    userId: varchar("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type").$type<AdapterAccount["type"]>().notNull(),
    provider: varchar("provider").notNull(),
    providerAccountId: varchar("providerAccountId").notNull(),
    refresh_token: varchar("refresh_token"),
    access_token: varchar("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type"),
    scope: varchar("scope"),
    id_token: varchar("id_token"),
    session_state: varchar("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

runBasicTests({
  adapter: DrizzleAdapter(
    db,
    {
      // TODO: MySQLVarchar doesn't fit with text?
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
    user: (id) => db.select().from(users).where(eq(users.id, id)) ?? null,
    // .where(eq(users.id, id)) ?? null,
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken)) ?? null,
    account: (provider_providerAccountId) => {
      return (
        db
          .select()
          .from(accounts)
          .where(
            eq(
              accounts.providerAccountId,
              provider_providerAccountId.providerAccountId
            )
          ) ?? null
      )
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
        ) ?? null,
  },
})
