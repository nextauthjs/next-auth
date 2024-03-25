import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import { Query } from "orchid-orm"

type UserType = Omit<AdapterUser, "id" | "emailVerified"> & {
  emailVerified?: Date | number | string | null
}

interface User extends Query {
  inputType: UserType
}

type AccountType = Omit<AdapterAccount, "access_token"> & {
  access_token?: string | null
}

interface Account extends Query {
  inputType: AccountType
}

type SessionInput = Omit<AdapterSession, "expires"> & {
  expires: Date | number | string
}

interface Session extends Query {
  inputType: SessionInput
}

type VerificationTokenInput = Omit<VerificationToken, "expires"> & {
  expires: Date | number | string
}

interface Token extends Query {
  inputType: VerificationTokenInput
}

interface Db {
  $transaction(fn: () => Promise<unknown>): Promise<void>
  user: User
  verificationToken?: Token
  account?: Account
  session?: Session
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseTime = (record: any, column: string) => {
  if (record[column] && !(record[column] instanceof Date)) {
    record[column] = new Date(record[column] as string)
  }
  return record as never
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseUser = (user: any) => parseTime(user, "emailVerified")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSession = (user: any) => parseTime(user, "expires")
const parseVerificationToken = parseSession

const methodsForAccount = (db: { user: User; account: Account }) => ({
  async getUserByAccount({
    provider,
    providerAccountId,
  }: Pick<
    AdapterAccount,
    "provider" | "providerAccountId"
  >): Promise<AdapterUser | null> {
    const user = await db.user
      .whereExists(
        db.account.where({ provider, providerAccountId }),
        "userId",
        "id"
      )
      .takeOptional()

    return user ? parseUser(user) : null
  },

  async linkAccount(data: AccountType): Promise<void> {
    await db.account.insert(data)
  },

  // This method is defined but not implemented by auth.js
  async unlinkAccount(
    params: Pick<AccountType, "provider" | "providerAccountId">
  ) {
    await db.account.findByOptional(params).delete()
  },
})

const methodsForSession = (db: Db & { session: Session }) => ({
  // Is used when session strategy is jwt
  async createSession(data: SessionInput): Promise<AdapterSession> {
    const session = await db.session.create(data)
    return parseSession(session)
  },

  async getSessionAndUser(
    sessionToken: string
  ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
    const result = await db.session
      .findByOptional({ sessionToken })
      .join(db.user, "id", "userId")
      .select("*", "user.*")

    if (!result) return null

    const { user, ...session } = result
    return { user: parseUser(user), session: parseSession(session) } as never
  },

  async updateSession({
    sessionToken,
    ...data
  }: Partial<SessionInput> &
    Pick<AdapterSession, "sessionToken">): Promise<undefined> {
    await db.session.findByOptional({ sessionToken }).update(data)
  },

  async deleteSession(sessionToken: string): Promise<void> {
    await db.session.findByOptional({ sessionToken }).delete()
  },
})

const methodsForVerificationToken = (db: { verificationToken: Token }) => ({
  async createVerificationToken(
    data: VerificationTokenInput
  ): Promise<undefined> {
    await db.verificationToken.insert(data)
  },

  async useVerificationToken(
    data: Pick<VerificationToken, "identifier" | "token">
  ): Promise<VerificationToken | null> {
    const token = await db.verificationToken
      .selectAll()
      .findByOptional(data)
      .delete()

    return token ? parseVerificationToken(token) : null
  },
})

/**
 * ## Setup
 *
 * ```bash npm2yarn
 * npm install orchid-orm
 * # optional, for migrations:
 * npm install rake-db
 * ```
 *
 * Usage:
 *
 * ```typescript title="app/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { OrchidOrmAdapter } from "@auth/adapter-orchid-orm"
 * import { db } from "./path/to/db"
 *
 * export default NextAuth({
 *   adapter: OrchidOrmAdapter(db),
 * })
 * ```
 *
 * User table is required, optional tables are:
 * - **account**: for OAuth2 providers, stores provider info and token data;
 * - **session**: to store user session when choosing database strategy, not needed for `jwt` strategy;
 * - **verificationToken**: for [Email](https://next-auth.js.org/providers/email) provider.
 *
 * Check out the default [models](/reference/core/adapters#models) required by Auth.js.
 *
 * OrchidORM doesn't parse timestamp values by default, you can configure it to parse timestamps to `Date` objects or epoch numbers.
 *
 * Auth.js requires certain columns to be parsed to `Date`, and this adapter does parse certain columns to `Date` disregarding how it was configured.
 * These columns are:
 * - **emailVerified** for the user table
 * - **expires** for the session table
 * - **expires** for the verification token table
 *
 * Define a `BaseTable` and tables:
 *
 * ```ts
 * import { createBaseTable } from "orchid-orm"
 *
 * export const BaseTable = createBaseTable({
 *   columnTypes: (t) => ({
 *     ...t,
 *     // parse all timestamp columns to date when loading data from the database
 *     timestamp: () => t.timestamp().asDate(),
 *     // to disable required min and max parameters of text column:
 *     text: (min = 0, max = Infinity) => t.text(min, max),
 *   }),
 * })
 *
 * export class UserTable extends BaseTable {
 *   readonly table = "user"
 *   columns = this.setColumns((t) => ({
 *     id: t.uuid().primaryKey(),
 *     name: t.text().nullable(),
 *     email: t.text(),
 *     image: t.text().nullable(),
 *     emailVerified: t.timestamp().nullable(),
 *   }))
 * }
 *
 * export class AccountTable extends BaseTable {
 *   readonly table = "account"
 *   columns = this.setColumns((t) => ({
 *     userId: t.uuid().foreignKey("user", "id", {
 *       onDelete: "CASCADE",
 *     }),
 *     type: t.text().asType((t) => t<"oauth" | "email" | "credentials">()),
 *     provider: t.text(),
 *     providerAccountId: t.text(),
 *     access_token: t.text().nullable(),
 *     token_type: t.text().nullable(),
 *     id_token: t.text().nullable(),
 *     refresh_token: t.text().nullable(),
 *     scope: t.text(),
 *     expires_at: t.integer().nullable(),
 *     session_state: t.text().nullable(),
 *     ...t.primaryKey(["provider", "providerAccountId"]),
 *   }))
 * }
 *
 * export class SessionTable extends BaseTable {
 *   readonly table = "session"
 *   columns = this.setColumns((t) => ({
 *     sessionToken: t.text().primaryKey(),
 *     userId: t.uuid().foreignKey("user", "id", {
 *       onDelete: "CASCADE",
 *     }),
 *     expires: t.timestamp(),
 *   }))
 * }
 *
 * export class VerificationTokenTable extends BaseTable {
 *   readonly table = "verificationToken"
 *   columns = this.setColumns((t) => ({
 *     identifier: t.text(),
 *     token: t.text(),
 *     expires: t.timestamp(),
 *     ...t.primaryKey(["identifier", "token"]),
 *   }))
 * }
 * ```
 *
 * Instantiate db:
 *
 * ```ts
 * import { orchidORM } from "orchid-orm"
 * import { config } from "./config"
 * import {
 *   AccountTable,
 *   SessionTable,
 *   UserTable,
 *   VerificationTokenTable,
 * } from "./tables"
 *
 * export const db = orchidORM(
 *   { databaseURL: config.databaseUrl },
 *   {
 *     user: UserTable,
 *     account: AccountTable,
 *     session: SessionTable,
 *     verificationToken: VerificationTokenTable,
 *   }
 * )
 * ```
 *
 * ## Migrations
 *
 * You can use any tool for database migrations.
 * The following section shows examples of migration files when using [rake-db](https://orchid-orm.netlify.app/guide/migration-setup-and-overview.html).
 *
 * The `account` table collects OAuth token info, and it's important for its columns to be named in *snake_case* as shown below.
 *
 * :::note
 * `account` and `session` have reference to `user` table, when rolling back the migration they should be dropped before `user`.
 * This is why `account` and `session` tables should be created in a separate `change` section, so that they run in the first order when rolling back.
 * :::
 *
 * ```ts
 * import { change } from "../db/dbScript"
 *
 * change(async (db) => {
 *   await db.createTable("user", (t) => ({
 *     id: t.uuid().primaryKey(),
 *     name: t.text().nullable(),
 *     email: t.text(),
 *     emailVerified: t.timestamp().nullable(),
 *     image: t.text().nullable(),
 *   }))
 *
 *   await db.createTable("verificationToken", (t) => ({
 *     identifier: t.text(),
 *     token: t.text(),
 *     expires: t.timestamp(),
 *     ...t.primaryKey(["identifier", "token"]),
 *   }))
 * })
 *
 * change(async (db) => {
 *   await db.createTable("account", (t) => ({
 *     userId: t.uuid().foreignKey("user", "id", {
 *       onDelete: "CASCADE",
 *     }),
 *     type: t.text(),
 *     provider: t.text(),
 *     providerAccountId: t.text(),
 *
 *     access_token: t.text().nullable(),
 *     token_type: t.text().nullable(),
 *     id_token: t.text().nullable(),
 *     refresh_token: t.text().nullable(),
 *     scope: t.text(),
 *     expires_at: t.integer().nullable(),
 *     session_state: t.text().nullable(),
 *     ...t.primaryKey(["provider", "providerAccountId"]),
 *   }))
 *
 *   await db.createTable("session", (t) => ({
 *     sessionToken: t.text().primaryKey(),
 *     userId: t.uuid().foreignKey("user", "id", {
 *       onDelete: "CASCADE",
 *     }),
 *     expires: t.timestamp(),
 *   }))
 * })
 * ```
 */
export const OrchidAdapter = (db: Db) => ({
  async createUser(data: UserType): Promise<AdapterUser> {
    const user = await db.user.create(data)
    return parseUser(user)
  },

  async getUser(id: string): Promise<AdapterUser | null> {
    const user = await db.user.findByOptional({ id })
    return user ? parseUser(user) : null
  },

  async getUserByEmail(email: string): Promise<AdapterUser | null> {
    const user = await db.user.findByOptional({ email })
    return user ? parseUser(user) : null
  },

  async updateUser({
    id,
    ...data
  }: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
    const user = await db.user.selectAll().findBy({ id }).update(data)
    return parseUser(user)
  },

  // This method is defined but not implemented by auth.js
  async deleteUser(userId: string): Promise<void> {
    await db.$transaction(() =>
      Promise.all([
        db.session && db.session.findByOptional({ userId }).delete(),
        db.account && db.account.findByOptional({ userId }).delete(),
        db.user.findByOptional({ id: userId }).delete(),
      ])
    )
  },

  ...(db.account
    ? methodsForAccount({ user: db.user, account: db.account })
    : {}),
  ...(db.session ? methodsForSession({ ...db, session: db.session }) : {}),
  ...(db.verificationToken
    ? methodsForVerificationToken({ verificationToken: db.verificationToken })
    : {}),
})
