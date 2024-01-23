/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>An official <a href="https://www.postgresql.org/">PostgreSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.postgresql.org/">
 *   <img style={{display: "block"}} src="/img/adapters/postgresjs.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/postgres-adapter postgres
 * ```
 *
 * @module @auth/postgres-adapter
 */

import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
  AdapterAccount,
} from "@auth/core/adapters"

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
CREATE TABLE verification_token
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,


PRIMARY KEY (identifier, token) );

CREATE TABLE accounts
(
  id SERIAL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  provider_id VARCHAR(255) NOT NULL,
  provider_type VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,


PRIMARY KEY (id) );

CREATE TABLE sessions
(
  id SERIAL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  expires TIMESTAMPTZ NOT NULL,
  session_token VARCHAR(255) NOT NULL,


PRIMARY KEY (id) );

CREATE TABLE users
(
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  image TEXT,


PRIMARY KEY (id) );

 *
 * ```
 *
 * ```typescript title="auth.ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import PostgresJSAdapter from "@auth/postgres-adapter"
 * import postgres from 'postgres'
 *

* export const sql = postgres(
*  process.env.POSTGRES_URL || 'postgresql://username:password@localhost:5432/database',
*  {
*    ssl: 'allow',
*    max: 20,
*    idle_timeout: 30,
*    connect_timeout: 30,
*    prepare: true, 
*    fetch_types: true, 
*  })
*
* 

 *
 * export default NextAuth({
 *   adapter: PostgresJSAdapter(sql),
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
export default function PostgresJSAdapter(sql: any): Adapter {
  return {
    async createVerificationToken(
      verificationToken
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
    }: Partial<VerificationToken>): Promise<VerificationToken> {
      const result = await sql`delete from verification_token
      where identifier = ${identifier} and token = ${token}
      RETURNING identifier, expires, token`
      return result.count !== 0 ? result[0] : null
    },
    async createUser(user: Omit<AdapterUser, "id">) {
      const { name, email, emailVerified, image } = user
      const result = await sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${name},${email}, ${emailVerified},${image}) 
        RETURNING id, name, email, "emailVerified", image`

      return result
    },
    async getUser(id) {
      const result = await sql`select * from users where id = ${id}`
      try {
        return result.count === 0 ? null : result[0]
      } catch (e) {
        return null
      }
    },
    async getUserByEmail(email) {
      const result = await sql`select * from users where email = ${email}`
      return result.count !== 0 ? result[0] : null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const result = await sql`
          select u.* from users u join accounts a on u.id = a."userId"
          where 
          a.provider = ${provider} 
          and 
          a."providerAccountId" = ${providerAccountId}`

      return result.count !== 0 ? result[0] : null
    },
    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const fetchSql = await sql`select * from users where id = ${user.id}`
      const oldUser = fetchSql[0]
      const newUser = {
        ...oldUser,
        ...user,
      }
      const { id, name, email, emailVerified, image } = newUser
      const updateSql = await sql`
        UPDATE users set
        name = ${name}, email = ${email}, "emailVerified" = ${emailVerified}, image = ${image}
        where id = ${id}
        RETURNING name, id, email, "emailVerified", image
      `

      return updateSql[0]
    },
    async linkAccount(account: AdapterAccount) {
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
      insert into accounts 
      (
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
      values (${userId},${provider}, ${type}, ${providerAccountId}, ${access_token},   to_timestamp(${expires_at}), ${refresh_token}, ${id_token}, ${scope}, ${session_state},${token_type})      
returning
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
      const result =
        await sql`insert into sessions ("userId", expires, "sessionToken")
      values (${userId}, ${expires}, ${sessionToken})
      RETURNING id, "sessionToken", "userId", expires`
      return result[0]
    },
    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (result1.count === 0) {
        return null
      }
      let session = result1[0]
      const result2 =
        await sql`select * from users where id = ${session.userId}`
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
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (result1.count === 0) {
        return null
      }
      const originalSession = result1[0]
      const newSession = {
        ...originalSession,
        ...session,
      }
      const result = await sql`
        UPDATE sessions set
        expires = ${newSession.expires}
        where "sessionToken" = ${newSession.sessionToken}
        `

      return result[0]
    },
    async deleteSession(sessionToken) {
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`
    },
    async deleteUser(userId) {
      await sql`delete from users where id = ${userId}`
      await sql`delete from sessions where "userId" = ${userId}`
      await sql`delete from accounts where "userId" = ${userId}`
    },
  }
}
