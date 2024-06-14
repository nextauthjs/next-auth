/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://www.surrealdb.com">SurrealDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.surrealdb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/surrealdb.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/surrealdb-adapter surrealdb.js
 * ```
 *
 * @module @auth/surrealdb-adapter
 */
import { RecordId, Surreal } from "surrealdb.js"
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import {
  userToDoc,
  docToUser,
  accountToDoc,
  docToAccount,
  sessionToDoc,
  docToSession,
  verificationTokenToDoc,
  docToVerificationToken,
} from "./converters.js"
import {
  UserDoc,
  AccountDoc,
  SessionDoc,
  VerificationTokenDoc,
} from "./types.js"

export function extractId(surrealId: RecordId) {
  return surrealId.id.toString()
}

export function SurrealDBAdapter(client: Promise<Surreal>): Adapter {
  return {
    async createUser(user: AdapterUser) {
      const surreal = await client
      const doc = userToDoc(user)

      const result = await surreal.create("user", doc)

      return docToUser(result[0] as UserDoc)
    },
    async getUser(id: string) {
      const surreal = await client

      const result = await surreal.select<UserDoc>(new RecordId("user", id))

      return result ? docToUser(result as UserDoc) : null
    },
    async getUserByEmail(email: string) {
      const surreal = await client

      const result = await surreal.query<UserDoc[][]>(
        `SELECT * FROM user WHERE email = $email`,
        { email }
      )
      const doc = result[0][0]
      return doc ? docToUser(doc) : null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client

      const result = await surreal.query<AccountDoc<UserDoc>[][]>(
        `SELECT userId
           FROM account
           WHERE providerAccountId = $providerAccountId
           AND provider = $provider
           FETCH userId`,
        { providerAccountId, provider }
      )

      const doc = result[0][0]
      return doc ? docToUser(doc.userId) : null
    },
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const surreal = await client
      const doc = userToDoc(user as AdapterUser)
      let result = await surreal.merge<UserDoc, Omit<UserDoc, "id">>(
        new RecordId("user", user.id),
        doc
      )

      return docToUser(result)
    },
    async deleteUser(id: string) {
      const surreal = await client

      const promises: Promise<any>[] = []
      const userId = new RecordId("user", id)

      // delete account
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const result = await surreal.query<AccountDoc[][]>(
              `SELECT *
          FROM account
          WHERE userId = $userId
          LIMIT 1`,
              { userId }
            )
            const account = result[0][0]
            if (account) {
              await surreal.delete(account.id)
            }
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      )

      // delete session
      promises.push(
        new Promise<void>(async (resolve, reject) => {
          try {
            const result = await surreal.query<SessionDoc[][]>(
              `SELECT *
          FROM session
          WHERE userId = $userId
          LIMIT 1`,
              { userId }
            )
            const session = result[0][0]
            if (session) {
              await surreal.delete(session.id)
            }
            resolve()
          } catch (e) {
            reject(e)
          }
        })
      )

      // delete user
      promises.push(surreal.delete(userId))
      await Promise.all(promises)
    },
    async linkAccount(account: AdapterAccount) {
      const surreal = await client
      const result = await surreal.create("account", accountToDoc(account))
      return docToAccount(result[0] as AccountDoc)
    },
    async unlinkAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client

      const result = await surreal.query<AccountDoc[][]>(
        `SELECT *
          FROM account
          WHERE providerAccountId = $providerAccountId
            AND provider = $provider
          LIMIT 1`,
        { providerAccountId, provider }
      )
      const account = result[0][0]
      if (account) {
        await surreal.delete(account.id)
      }
    },
    async createSession(session: AdapterSession) {
      const surreal = await client
      const doc = sessionToDoc(session)
      const result = await surreal.create(
        new RecordId("session", doc.sessionToken),
        doc
      )

      return docToSession(result as SessionDoc<RecordId>)
    },
    async getSessionAndUser(sessionToken: string) {
      const surreal = await client

      const sessionRecordId = new RecordId("session", sessionToken)
      const result = await surreal.query<SessionDoc<UserDoc>[][]>(
        `SELECT *
           FROM $sessionRecordId
           FETCH userId`,
        { sessionRecordId }
      )

      const session = result[0][0]
      if (!session) {
        return null
      }

      const userDoc = session.userId
      const sessionDoc = {
        ...session,
        userId: userDoc.id,
      }

      return {
        user: docToUser(userDoc),
        session: docToSession(sessionDoc),
      }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null> {
      const surreal = await client

      const result = await surreal.merge(
        new RecordId("session", session.sessionToken),
        session
      )

      return result ? docToSession(result as SessionDoc) : null
    },
    async deleteSession(sessionToken: string) {
      const surreal = await client

      await surreal.delete(new RecordId("session", sessionToken))
    },
    async createVerificationToken(token: VerificationToken) {
      const surreal = await client

      const doc = verificationTokenToDoc(token)

      const result = await surreal.create<VerificationTokenDoc>(doc.id, doc)

      return docToVerificationToken(result)
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }) {
      const surreal = await client

      const id = new RecordId("verification_token", { token, identifier })

      const result = await surreal.select<VerificationTokenDoc>(id)
      if (!result) {
        return null
      }

      await surreal.delete(result.id)
      return docToVerificationToken(result)
    },
  }
}
