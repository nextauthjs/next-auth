/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>An official <a href="https://www.postgresql.org/">PostgreSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.postgresql.org/">
 *   <img style={{display: "block"}} src="/img/adapters/pg.png" width="48" />
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
} from '@auth/core/adapters'

import postgres from 'postgres'

export function mapExpiresAt(account: any): any {
  const expires_at: number = parseInt(account.expires_at)
  return {
    ...account,
    expires_at,
  }
}

/**
 * ## Setup
 *
 * The SQL schema for the tables used by this adapter is as follows. Learn more about the models at our doc page on [Database Models](https://authjs.dev/getting-started/adapters#models).
 *
 * ```sql
 * CREATE TABLE verification_token
 * (
 *   identifier TEXT NOT NULL,
 *   expires TIMESTAMPTZ NOT NULL,
 *   token TEXT NOT NULL,
 *
 *   PRIMARY KEY (identifier, token)
 * );
 *
 * CREATE TABLE accounts
 * (
 *   id SERIAL,
 *   "userId" INTEGER NOT NULL,
 *   type VARCHAR(255) NOT NULL,
 *   provider VARCHAR(255) NOT NULL,
 *   "providerAccountId" VARCHAR(255) NOT NULL,
 *   refresh_token TEXT,
 *   access_token TEXT,
 *   expires_at BIGINT,
 *   id_token TEXT,
 *   scope TEXT,
 *   session_state TEXT,
 *   token_type TEXT,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * CREATE TABLE sessions
 * (
 *   id SERIAL,
 *   "userId" INTEGER NOT NULL,
 *   expires TIMESTAMPTZ NOT NULL,
 *   "sessionToken" VARCHAR(255) NOT NULL,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * CREATE TABLE users
 * (
 *   id SERIAL,
 *   name VARCHAR(255),
 *   email VARCHAR(255),
 *   "emailVerified" TIMESTAMPTZ,
 *   image TEXT,
 *
 *   PRIMARY KEY (id)
 * );
 *
 * ```
 *
 * ```typescript title="auth.ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import postgres from 'postgres'
 *
 *
 *
 * const sql = postgres({
 * database: 'nuxt-sidebase-auth',
 *  transform: {
 *    undefined: null,
 *  },
 * })
 *
 * export default sql
 *
 * export default NextAuth({
 *   adapter: PostgresJSAdapter(pool),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 */
export default function PostgresJSAdapter(sql: postgres.Sql<{}>): Adapter {
  return {
    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken

      await sql`
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES (${identifier}, ${expires}, ${token})
      `
      return verificationToken
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }): Promise<VerificationToken> {
      const result = await sql`
        DELETE FROM verification_token
        WHERE identifier = ${identifier} and token = ${token}
        RETURNING identifier, expires, token
      `

      return (result.count !== 0 ? result[0] : null) as VerificationToken
    },

    async createUser(user: Omit<AdapterUser, 'id'>) {
      const { name, email, emailVerified, image } = user

      const result = await sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${name}, ${email}, ${emailVerified}, ${image}) 
        RETURNING id, name, email, "emailVerified", image
      `
      return result[0]
    },

    async getUser(id) {
      try {
        const result = await sql`
          SELECT * 
          FROM users 
          WHERE id = ${id}
        `
        return result.count === 0 ? null : result[0]
      } catch (e) {
        return null
      }
    },

    async getUserByEmail(email: string) {
      const result = await sql`
        SELECT * 
        FROM users
        WHERE email = ${email}
      `

      return result.count !== 0 ? result[0] : null
    },

    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const result = await sql`
      SELECT u.* 
      FROM users u
      JOIN accounts a ON u.id = a."userId"
      WHERE
      a.provider = ${provider} 
      AND 
      a."providerAccountId" = ${providerAccountId}
  `
      return result.count !== 0 ? result[0] : null
    },

    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const query1 = await sql`
        SELECT * 
        FROM users
        WHERE id = $${user.id}
      `
      const oldUser = query1[0]

      const newUser = {
        ...oldUser,
        ...user,
      }

      const { id, name, email, emailVerified, image } = newUser
      const query2 = await sql`
        UPDATE users SET
        name = ${name}, email = ${email}, "emailVerified" = ${emailVerified}, image = ${image}
        WHERE id = ${id}
        RETURNING name, id, email, "emailVerified", image
      `

      return query2[0]
    },

    async linkAccount(account) {
      const {
        userId,
        provider,
        type,
        providerAccountId,
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type,
      } = account

      const result = await sql`
      INSERT INTO accounts (
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      VALUES (${userId}, ${provider}, ${type}, ${providerAccountId}, ${access_token}, ${expires_at}, ${refresh_token}, ${id_token}, ${scope}, ${session_state}, ${token_type})
      RETURNING
        id,
        "userId", 
        provider, 
        type, 
        "providerAccountId", 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      `

      return mapExpiresAt(result[0])
    },

    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`)
      }

      const result = await sql`
        INSERT INTO sessions ("userId", expires, "sessionToken")
        VALUES (${userId}, ${expires}, ${sessionToken})
        RETURNING id, "sessionToken", "userId", expires
      `

      return result[0]
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const result1 = await sql`
        SELECT *
        FROM sessions
        WHERE "sessionToken" = ${sessionToken}
      `
      if (result1.count === 0) {
        return null
      }
      let session: AdapterSession = result1[0]

      const result2 = await sql`
        SELECT *
        FROM users
        WHERE id = ${session.userId}
      `

      if (result2.count === 0) {
        return null
      }

      const user = result2[0]
      return {
        session,
        user,
      }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const result1 = await sql`
        SELECT *
        FROM sessions
        WHERE "sessionToken" = ${sessionToken}
      `
      if (result1.count === 0) {
        return null
      }
      const originalSession: AdapterSession = result1[0]

      const newSession: AdapterSession = {
        ...originalSession,
        ...session,
      }

      const result = await sql`
        UPDATE sessions 
        SET expires = ${newSession.expires}
        WHERE "sessionToken" = ${newSession.sessionToken}
      `
      return result[0]
    },

    async deleteSession(sessionToken) {
      await sql`
        DELETE FROM sessions
        WHERE "sessionToken" = ${sessionToken}
      `
    },

    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount

      await sql`
        DELETE FROM accounts
        WHERE "providerAccountId" = ${providerAccountId} AND provider = ${provider}
      `
    },

    async deleteUser(userId: string) {
      await sql`delete from users where id = ${userId}`
      await sql`delete from sessions where "userId" = ${userId}`
      await sql`delete from accounts where "userId" = ${userId}`
    },
  }
}
