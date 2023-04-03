import Surreal from "surrealdb.js"
import type { Result } from "surrealdb.js"
import { VerificationToken } from "next-auth/adapters"

import {
  SurrealDBAdapter,
  docToUser,
  docToAccount,
  docToSession,
} from "../src/index"
import type { UserDoc, AccountDoc, SessionDoc } from "../src/index"

export const config = (clientPromise: Promise<Surreal>) => ({
  adapter: SurrealDBAdapter(clientPromise),
  db: {
    async disconnect() {
      const surreal = await clientPromise
      if (surreal.close) surreal.close()
    },
    async user(id) {
      const surreal = await clientPromise
      try {
        const users = await surreal.select<UserDoc>(`user:${id}`)
        const user = users[0]
        return docToUser(user)
      } catch (e) {
        return null
      }
    },
    async account({ provider, providerAccountId }) {
      const surreal = await clientPromise
      const accounts = await surreal.query<Result<AccountDoc[]>[]>(
        `SELECT * FROM account WHERE provider = $provider AND providerAccountId = $providerAccountId`,
        { provider, providerAccountId }
      )
      const account = accounts[0].result?.[0]
      if (account) {
        return docToAccount(account)
      }
      return null
    },
    async session(sessionToken) {
      const surreal = await clientPromise
      const sessions = await surreal.query<Result<SessionDoc[]>[]>(
        `SELECT * FROM session WHERE sessionToken = $sessionToken`,
        { sessionToken }
      )
      const session = sessions[0].result?.[0]
      if (session) {
        return docToSession(session)
      }
      return null
    },
    async verificationToken({ identifier, token }) {
      const surreal = await clientPromise
      const tokens = await surreal.query<
        Result<(VerificationToken & { id: string })[]>[]
      >(
        `SELECT *
         FROM verification_token
         WHERE identifier = $identifier
           AND token = $token
         LIMIT 1`,
        { identifier, token }
      )
      const verificationToken = tokens[0].result?.[0]
      if (verificationToken) {
        return {
          identifier: verificationToken.identifier,
          expires: new Date(verificationToken.expires),
          token: verificationToken.token,
        }
      }
      return null
    },
  },
})
