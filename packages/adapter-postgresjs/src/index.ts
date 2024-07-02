/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>An official <a href="https://www.postgresql.org/">PostgreSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.postgresql.org/">
 *   <img style={{display: "block"}} src="/img/adapters/postgresjs.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth@beta @auth/postgresjs-adapter postgres
 * ```
 *
 * @module @auth/postgresjs-adapter
 */

import type {
  Adapter,
  AdapterAccount,
  AdapterUser,
  VerificationToken,
  AdapterSession,
  AdapterAuthenticator,
} from "@auth/core/adapters"
import type postgres from "postgres"
import { nanoid } from "./id.js"
type UserSession = AdapterSession & AdapterUser
type SQL = postgres.Sql<{}>
export default function PostgresJSAdapter(sql: SQL): Adapter {
  return {
    async createVerificationToken(
      v: VerificationToken
    ): Promise<VerificationToken> {
      const data = {
        identifier: v.identifier,
        expires: v.expires,
        token: v.token,
      }
      await sql`insert into verification_token ${sql(data)}`
      return v
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }): Promise<VerificationToken> {
      const [res] = await sql<
        VerificationToken[]
      >`delete from verification_token where identifier = ${identifier} and token = ${token} RETURNING identifier, expires, token`
      return res ?? null
    },
    async createUser(data: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      const user = {
        ...data,
        id: nanoid(),
      }
      const [res] = await sql<AdapterUser[]>`INSERT INTO users ${sql(
        user
      )} RETURNING *`
      return res
    },
    async getUser(id) {
      try {
        const res = await sql<
          AdapterUser[]
        >`select * from users where id = ${id}`
        return res.count === 0 ? null : res[0]
      } catch (e) {
        return null
      }
    },
    async getUserByEmail(email) {
      try {
        const res = await sql<
          AdapterUser[]
        >`select * from users where email = ${email}`
        return res.count === 0 ? null : res[0]
      } catch (e) {
        return null
      }
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const [res] = await sql<AdapterUser[]>`
      select u.* from users u join accounts a on u.id = a."userId"
      where a.provider = ${provider} and a."providerAccountId" = ${providerAccountId}`
      if (!res) return null
      return res
    },
    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      const [oldUser] = await sql<
        AdapterUser[]
      >`select * from users where id = ${user.id!}`
      const newUser = { ...oldUser, ...user }

      const { id, name, email, emailVerified, image } = newUser
      const [newData] = await sql<AdapterUser[]>`UPDATE users set
      name = ${name!}, email = ${email!}, "emailVerified" = ${emailVerified}, 
      image = ${image!} where id = ${id!} RETURNING *`

      return newData
    },
    async linkAccount(acc: AdapterAccount) {
      await sql<AdapterAccount[]>`insert into accounts ${sql(acc)}`
      return acc
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`)
      }
      const [res] = await sql<
        AdapterSession[]
      >`insert into sessions ("userId", expires, "sessionToken") values (${userId}, ${expires}, ${sessionToken}) RETURNING *`
      return res
    },
    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const [res] = await sql<
        UserSession[]
      >`select s.*,u.name,u.email,u."emailVerified", u.image from sessions s join users u on s."userId" = u.id 
        where s."sessionToken" = ${sessionToken}`
      if (!res) return null
      const { userId, expires, ...user } = res
      const session = { sessionToken, userId, expires }
      return {
        session,
        user,
      }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const r1 = await sql<
        AdapterSession[]
      >`select * from sessions where "sessionToken" = ${sessionToken}`
      if (r1.count === 0) {
        return null
      }
      const newSession: AdapterSession = { ...r1[0], ...session }
      const [result] = await sql<AdapterSession[]>`update sessions set 
      ${sql(newSession)} where "sessionToken" = ${newSession.sessionToken}`
      return result
    },
    async deleteSession(sessionToken) {
      await sql`delete from sessions where "sessionToken" = ${sessionToken}`
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await sql`delete from accounts where provider = ${provider} and "providerAccountId" = ${providerAccountId}`
    },
    async deleteUser(userId: string) {
      await sql.begin((sql) => [
        sql`delete from users where id = ${userId}`,
        sql`delete from sessions where "userId" = ${userId}`,
        sql`delete from accounts where "userId" = ${userId}`,
      ])
    },
    async createAuthenticator(
      data: AdapterAuthenticator
    ): Promise<AdapterAuthenticator> {
      const [res] = await sql<
        AdapterAuthenticator[]
      >`insert into authenticators ${sql(data)} RETURNING *`
      return res
    },
    async getAuthenticator(credentialID: string) {
      try {
        const res = await sql<
          AdapterAuthenticator[]
        >`select * from authenticators where "credentialID" = ${credentialID}`
        return res.count === 0 ? null : res[0]
      } catch (e) {
        return null
      }
    },
    async listAuthenticatorsByUserId(
      userId: string
    ): Promise<AdapterAuthenticator[]> {
      const res = await sql<
        AdapterAuthenticator[]
      >`select * from authenticators where "userId" = ${userId}`
      return res
    },
    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const authenticator = await sql<
        AdapterAuthenticator[]
      >`UPDATE authenticators set counter = ${newCounter!} where "credentialID" = ${credentialID} RETURNING *`
      if (!authenticator) throw new Error("Authenticator not found.")
      return authenticator[0]
    },
  }
}
