/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>An official <a href="https://github.com/porsager/postgres">Postgres.js</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://github.com/porsager/postgres">
 *   <img style={{display: "block"}} src="/img/adapters/postgresjs.svg" height="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/postgresjs-adapter postgres
 * ```
 *
 * @module @auth/postgresjs-adapter
 */

import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
  AdapterAccount,
} from "@auth/core/adapters"
import postgresjs from "postgres"
import {
  DBAccount,
  DBSession,
  DBUser,
  DBVerificationToken,
  fromPartialAdapterUser,
  toAdapterAccount,
  toAdapterSession,
  toAdapterUser,
  toAdapterVerificationToken,
} from "./types.js"

function buildPartialSetStatement(partial: object, sql: postgresjs.Sql) {
  const fieldsToSet = Object.entries(partial).filter(
    ([key, value]) => value !== undefined && key !== "id"
  )

  return sql(Object.fromEntries(fieldsToSet))
}

export default function PostgresjsAdapter(sql: postgresjs.Sql): Adapter {
  return {
    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken

      await sql`
        INSERT INTO verification_tokens ( identifier, expires, token ) 
        VALUES (${identifier}, ${expires}, ${token})
        RETURNING identifier, expires, token;
        `

      return verificationToken
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }) {
      const [verificationToken] = await sql<DBVerificationToken[]>`
        DELETE FROM verification_tokens
        WHERE identifier = ${identifier} AND token = ${token}
        RETURNING identifier, expires, token;
      `

      return verificationToken
        ? toAdapterVerificationToken(verificationToken)
        : null
    },

    async createUser(user: Omit<AdapterUser, "id">) {
      const { name, email, emailVerified, image } = user

      const [newUser] = await sql<DBUser[]>`
        INSERT INTO users (name, email, email_verified, image) 
        VALUES (${name ?? null}, ${email}, ${emailVerified}, ${image ?? null}) 
        RETURNING id, name, email, email_verified, image`

      return toAdapterUser(newUser)
    },

    async getUser(id) {
      const [dbUser] = await sql<
        DBUser[]
      >`SELECT * FROM users WHERE id = ${id} LIMIT 1`

      return dbUser ? toAdapterUser(dbUser) : null
    },

    async getUserByEmail(email) {
      const [dbUser] = await sql<DBUser[]>`
        SELECT * FROM users WHERE email = ${email} LIMIT 1
      `

      return dbUser ? toAdapterUser(dbUser) : null
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const [dbUser] = await sql<DBUser[]>`
          SELECT u.* 
          FROM users u 
          JOIN accounts a ON u.id = a.user_id
          WHERE a.provider = ${provider} 
          AND a.provider_account_id = ${providerAccountId}
          LIMIT 1`

      return dbUser ? toAdapterUser(dbUser) : null
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { id } = user

      if (id === undefined) {
        throw new Error("No user id.")
      }

      const setStatement = buildPartialSetStatement(
        fromPartialAdapterUser(user),
        sql
      )

      const [updatedUser] = await sql<DBUser[]>`
        UPDATE users
        SET ${setStatement}
        WHERE id = ${id}
        RETURNING name, id, email, email_verified, image
      `

      return toAdapterUser(updatedUser)
    },

    async linkAccount(account: AdapterAccount) {
      const [newAccount] = await sql<DBAccount[]>`
        INSERT INTO accounts 
        (
          user_id,
          provider,
          type,
          provider_account_id,
          access_token,
          expires_at,
          refresh_token,
          id_token,
          scope,
          session_state,
          token_type
        )
        VALUES (
          ${account.userId},
          ${account.provider},
          ${account.type},
          ${account.providerAccountId},
          ${account.access_token ?? null},
          ${account.expires_at ?? null},
          ${account.refresh_token ?? null},
          ${account.id_token ?? null},
          ${account.scope ?? null},
          ${account.session_state?.toString() ?? null},
          ${account.token_type ?? null}
        )
        RETURNING
          *
      `

      return toAdapterAccount(newAccount)
    },

    async createSession({ sessionToken, userId, expires }) {
      const [session] = await sql<
        DBSession[]
      >`INSERT INTO sessions (user_id, expires, session_token)
      VALUES (${userId}, ${expires}, ${sessionToken})
      RETURNING id, session_token, user_id, expires`

      return toAdapterSession(session)
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const [session] = await sql<
        DBSession[]
      >`SELECT * FROM sessions WHERE session_token = ${sessionToken} LIMIT 1`

      if (!session) {
        return null
      }

      const [user] = await sql<
        DBUser[]
      >`SELECT * FROM users WHERE id = ${session.user_id} LIMIT 1`

      if (!user) {
        return null
      }

      return {
        session: toAdapterSession(session),
        user: toAdapterUser(user),
      }
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken, expires } = session

      if (!expires) {
        const [session] = await sql<DBSession[]>`
          SELECT * FROM sessions WHERE session_token = ${sessionToken} LIMIT 1
        `
        return session ? toAdapterSession(session) : null
      }

      const [updatedSession] = await sql<DBSession[]>`
        UPDATE sessions 
        SET expires = ${expires}
        WHERE session_token = ${sessionToken}
        `
      return updatedSession ? toAdapterSession(updatedSession) : null
    },

    async deleteSession(sessionToken) {
      await sql<DBSession[]>`
        DELETE FROM sessions
        WHERE session_token = ${sessionToken}
        RETURNING *
      `
    },

    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await sql<DBAccount[]>`
        DELETE FROM accounts
        WHERE provider_account_id = ${providerAccountId}
        AND provider = ${provider}
        RETURNING *
      `
    },

    async deleteUser(userId: string) {
      await sql<DBUser[]>`
        DELETE FROM users
        WHERE id = ${userId}
        RETURNING *
      `
      await sql<DBSession[]>`
        DELETE FROM sessions
        WHERE user_id = ${userId}
        RETURNING *
      `
      await sql<DBAccount[]>`
        DELETE FROM accounts
        WHERE user_id = ${userId}
        RETURNING *
      `
    },
  }
}
