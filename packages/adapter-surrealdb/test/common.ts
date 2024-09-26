import { RecordId, Surreal } from "surrealdb"

import {
  SurrealDBAdapter,
  docToUser,
  docToAccount,
  docToSession,
  docToVerificationToken,
} from "../src/index"
import type {
  UserDoc,
  AccountDoc,
  SessionDoc,
  VerificationTokenDoc,
} from "../src/index"
import { randomUUID } from "utils/adapter"

export const config = (clientPromise: Promise<Surreal>) => ({
  adapter: SurrealDBAdapter(clientPromise),
  db: {
    id() {
      return randomUUID()
    },
    connect: async () => {
      const surreal = await clientPromise
      await Promise.all([
        surreal.delete("account"),
        surreal.delete("session"),
        surreal.delete("verification_token"),
        surreal.delete("user"),
      ])
    },
    disconnect: async () => {
      const surreal = await clientPromise
      try {
        await Promise.all([
          surreal.delete("account"),
          surreal.delete("session"),
          surreal.delete("verification_token"),
          surreal.delete("user"),
        ])
      } catch (e) {
        console.log(e)
      }
      if (surreal.close) surreal.close()
    },
    async user(id: string) {
      const userId = new RecordId("user", id)
      const surreal = await clientPromise
      const [users] = await surreal.query<[UserDoc[]]>(`SELECT * FROM $user`, {
        user: userId,
      })
      const user = users.at(0)
      console.log(user)
      if (user) return docToUser(user)
      return null
    },
    async account({ provider, providerAccountId }) {
      const surreal = await clientPromise
      const [accounts] = await surreal.query<[AccountDoc[]]>(
        `SELECT * FROM account WHERE provider = $provider AND providerAccountId = $providerAccountId`,
        { provider, providerAccountId }
      )
      const account = accounts.at(0)
      if (account) return docToAccount(account)
      return null
    },
    async session(sessionToken: string) {
      const surreal = await clientPromise
      const [sessions] = await surreal.query<[SessionDoc[]]>(
        `SELECT * FROM session WHERE sessionToken = $sessionToken`,
        { sessionToken }
      )
      const session = sessions.at(0)
      if (session) return docToSession(session)
      return null
    },
    async verificationToken({ identifier, token }) {
      const surreal = await clientPromise
      const [tokens] = await surreal.query<[VerificationTokenDoc[]]>(
        `SELECT * FROM verification_token WHERE identifier = $identifier AND token = $vt LIMIT 1`,
        { identifier, vt: token }
      )
      const verificationToken: Partial<VerificationTokenDoc> | undefined =
        tokens.at(0)
      if (verificationToken) {
        if (verificationToken.id) delete verificationToken.id
        return docToVerificationToken(
          verificationToken as Omit<VerificationTokenDoc, "id">
        )
      }
      return null
    },
  },
})
