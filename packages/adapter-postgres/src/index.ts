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
import { Session, User } from "@auth/core/types"
import * as postgres from "postgres"
import { PostgresType, Sql } from "postgres"

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
* CREATE TABLE users
* (
*  id SERIAL,
*  name VARCHAR(255),
*  email VARCHAR(255),
*  "emailVerified" BOOLEAN DEFAULT false,
*  image TEXT,
*
*
* PRIMARY KEY (id) );
*
* CREATE TABLE verification_token (
*    identifier TEXT NOT NULL,
*    expires TIMESTAMPTZ NOT NULL,
*    token TEXT NOT NULL,
*
*    PRIMARY KEY (identifier, token)
* );
* CREATE TABLE accounts (
*    id SERIAL,
*    "userId" INTEGER NOT NULL REFERENCES users(id),
*    type VARCHAR(255) NOT NULL,
*    provider VARCHAR(255) NOT NULL,
*    "providerAccountId" VARCHAR(255) NOT NULL,
*    refresh_token TEXT,
*    access_token TEXT,
*    expires_at BIGINT,
*    id_token TEXT,
*    scope TEXT,
*    session_state TEXT,
*    token_type TEXT,
*    PRIMARY KEY (id)
* );
* CREATE TABLE sessions (
*    id SERIAL,
*    "userId" INTEGER NOT NULL REFERENCES users(id),
*    expires TIMESTAMPTZ NOT NULL,
*    "sessionToken" VARCHAR(255) NOT NULL,
*    
*    PRIMARY KEY (id)
*  );
*
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

export interface Database {
  User: AdapterUser | Partial<AdapterUser>
  Account: AdapterAccount
  Session: AdapterSession
  VT: VerificationToken | Partial<VerificationToken>
}

/* export default function PostgresJSAdapter(sql): Adapter {
  return {
    createUser: (data) => sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${data.name},${data.email}, ${data.emailVerified},${data.image}) 
        RETURNING *`,

    async createUser(user: Omit<AdapterUser, "id">) {
      const { name, email, emailVerified, image } = user
      const result = await sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${name},${email}, ${emailVerified},${image}) 
        RETURNING *`
      console.log(...result)

      return result[0]
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
    async deleteUser(userId) {
      await sql`delete from users where id = ${userId}`
      await sql`delete from sessions where "userId" = ${userId}`
      await sql`delete from accounts where "userId" = ${userId}`
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
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`
    },
    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      let session =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`
      if (session.count === 0) {
        return null
      }
      let user = await sql`select * from users where id = ${session[0].userId}`
      if (user.count === 0) {
        return null
      }
      console.log({ user, session })

      return {
        session,
        user,
      }
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
    async createVerificationToken(
      verificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken
      await sql`
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES (${identifier}, ${expires}, ${token})
        RETURNING verification_token
        `
      console.log(verificationToken)
      return verificationToken
    },
    async useVerificationToken(
      verificationToken
    ): Promise<Maybe<VerificationToken>> {
      const { identifier, token } = verificationToken

      let res = await sql`delete from verification_token
      where identifier = ${identifier} and token = ${token}
      RETURNING *`
      return res[0]
    },
  }
} */

export default function PostgresJSAdapter(sql: any): Adapter {
  return {
    createUser: (data) => sql`
        INSERT INTO users (name, email, "emailVerified", image) 
        VALUES (${data.name},${data.email}, ${data.emailVerified},${data.image}) 
        RETURNING *`,
    getUser: (id) => sql`select * from users where id = ${id}`,
    getUserByEmail: (email) => sql`select * from users where email = ${email}`,
    getUserByAccount: ({ providerAccountId, provider }) =>
      sql`
          select u.* from users u join accounts a on u.id = a."userId"
          where 
          a.provider = ${provider} 
          and 
          a."providerAccountId" = ${providerAccountId}
          returning accounts.userId`.then((res: any[]) => res[0] ?? null),
    updateUser: async (user: Partial<AdapterUser>): Promise<AdapterUser> => {
      /*       const fetchSql = await sql`select * from users where id = ${user.id}`
      const oldUser: User = fetchSql[0]
      const newUser = {
        ...oldUser,
        ...user,
      }
      const { id, name, email, emailVerified, image } = newUser
      const updateSql = await sql`
        UPDATE users set
        name = ${name}, email = ${email}, "emailVerified" = ${emailVerified}, image = ${image}
        where id = ${id}
        RETURNING *
      `

      return updateSql[0] */
      const rows: AdapterUser[] = await sql`
            UPDATE users
            SET name = ${user.name}, email = ${user.email}, image = ${user.image}
            WHERE id = ${user.id}
            RETURNING id, name, email, image;
            `
      const updatedUser = {
        ...rows[0],
        id: rows[0].id.toString(),
        emailVerified: rows[0].emailVerified,
        email: rows[0].email,
      }
      return updatedUser
    },
    deleteUser: async (userId) => {
      await Promise.all([
        await sql`delete from users where id = ${userId}`,
        await sql`delete from sessions where "userId" = ${userId}`,
        await sql`delete from accounts where "userId" = ${userId}`,
      ])
    },
    linkAccount: (account: AdapterAccount) =>
      sql`insert into accounts 
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
      values (${account.userId},${account.provider}, ${account.type}, ${account.providerAccountId}, ${account.access_token},to_timestamp(${account.expires_at}), ${account.refresh_token}, ${account.id_token}, ${account.scope}, ${account.session_state},${account.token_type})      
      returning *`.then((res: any[]) => mapExpiresAt(res[0]) ?? null),

    unlinkAccount: async (partialAccount) => {
      const { provider, providerAccountId } = partialAccount
      await sql`delete from accounts where "providerAccountId" = ${providerAccountId} and provider = ${provider}`
      return
    },
    getSessionAndUser: (sessionToken) =>
      sql`
          select u.* from users u join sessions s on u.id = s."userId"
          where "sessionToken" = ${sessionToken}
          returning sessions, users`.then((res: any[]) => res[0] ?? null),

    createSession: ({ sessionToken, userId, expires }) =>
      sql`insert into sessions ("userId", expires, "sessionToken")
      values (${userId}, ${expires}, ${sessionToken})
      RETURNING *`.then((res: Session[]) => res[0] ?? null),

    updateSession: async (session) => {
      const { sessionToken } = session
      const result1 =
        await sql`select * from sessions where "sessionToken" = ${sessionToken}`

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
    deleteSession: async (sessionToken) =>
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`,
    createVerificationToken: async (
      verificationToken
    ): Promise<VerificationToken> => {
      const { identifier, expires, token } = verificationToken
      await sql`
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES (${identifier}, ${expires}, ${token})
        RETURNING verification_token
        `
      console.log(verificationToken)
      return verificationToken
    },
    useVerificationToken: async (verificationToken) => {
      const { identifier, token } = verificationToken
      let res = await sql`delete from verification_token
      where identifier = ${identifier} and token = ${token}
      RETURNING *`
      return res[0]
    },
  }
}
