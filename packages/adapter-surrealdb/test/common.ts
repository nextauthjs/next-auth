import { Surreal, RecordId } from "surrealdb.js"
import { SurrealDBAdapter } from "../src/index"
import { TestOptions, randomUUID } from "utils/adapter"
import {
  docToUser,
  docToAccount,
  docToSession,
  docToVerificationToken,
} from "../src/converters"
import {
  UserDoc,
  AccountDoc,
  SessionDoc,
  VerificationTokenDoc,
} from "../src/types"

export function config(clientPromise: Promise<Surreal>): TestOptions {
  return {
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
        const surreal = await clientPromise

        const doc = await surreal.select<UserDoc>(new RecordId("user", id))
        return doc ? docToUser(doc) : null
      },
      async account({ provider, providerAccountId }) {
        const surreal = await clientPromise

        const result = await surreal.query<AccountDoc[][]>(
          `SELECT * FROM account WHERE provider = $provider AND providerAccountId = $providerAccountId`,
          { provider, providerAccountId }
        )
        const account = result[0][0]
        return account ? docToAccount(account) : null
      },
      async session(sessionToken: string) {
        const surreal = await clientPromise
        const sessionRecordId = new RecordId("session", sessionToken)
        const result =
          await surreal.select<SessionDoc<RecordId>>(sessionRecordId)

        return result ? docToSession(result) : null
      },
      async verificationToken({ identifier, token }) {
        const surreal = await clientPromise

        const id = new RecordId("verification_token", { token, identifier })

        const result = await surreal.select<VerificationTokenDoc>(id)

        return result ? docToVerificationToken(result) : null
      },
    },
  }
}
