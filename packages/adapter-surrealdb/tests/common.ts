import Surreal, { ExperimentalSurrealHTTP } from "surrealdb.js"

import {
  SurrealDBAdapter,
  docToUser,
  docToAccount,
  docToSession,
} from "../src/index"
import type { UserDoc, AccountDoc, SessionDoc } from "../src/index"

export const config = (
  clientPromise: Promise<Surreal | ExperimentalSurrealHTTP<typeof fetch>>
) => ({
  adapter: SurrealDBAdapter(clientPromise),
  db: {
    async disconnect() {
      const surreal = await clientPromise
      try {
        await surreal.delete("account")
        await surreal.delete("session")
        await surreal.delete("verification_token")
      } catch (e) {
        console.log(e)
      }
      if (surreal.close) surreal.close()
    },
    async user(id: string) {
      const surreal = await clientPromise
      try {
        const users = await surreal.query<[UserDoc[]]>("SELECT * FROM $user", {
          user: `user:${id}`,
        })
        const user = users[0]
        if (user.result?.[0] !== undefined) return docToUser(user.result[0])
      } catch (e) {}
      return null
    },
    async account({ provider, providerAccountId }) {
      const surreal = await clientPromise
      const accounts = await surreal.query<[AccountDoc[]]>(
        `SELECT * FROM account WHERE provider = $provider AND providerAccountId = $providerAccountId`,
        { provider, providerAccountId }
      )
      const account = accounts[0]
      if (account.result?.[0] !== undefined)
        return docToAccount(account.result[0])
      return null
    },
    async session(sessionToken: string) {
      const surreal = await clientPromise
      const sessions = await surreal.query<[SessionDoc[]]>(
        `SELECT * FROM session WHERE sessionToken = $sessionToken`,
        { sessionToken }
      )
      const session = sessions[0].result?.[0]
      if (session !== undefined) {
        return docToSession(session)
      }
      return null
    },
    async verificationToken({ identifier, token }) {
      const surreal = await clientPromise
      const tokens = await surreal.query<
        [{ identifier: string; expires: string; token: string; id: string }[]]
      >(
        `SELECT *
         FROM verification_token
         WHERE identifier = $identifier
           AND token = $verificationToken
         LIMIT 1`,
        { identifier, verificationToken: token }
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
