import { TestOptions } from "@next-auth/adapter-test"
import type { Kysely } from "kysely"
import type { DB } from "../src/dbTypes"

export function dbHelper(db: Kysely<DB>): TestOptions["db"] {
  return {
    async disconnect() {
      await db.destroy()
    },
    async user(id) {
      const user = await db
        .selectFrom("user")
        .selectAll()
        .where("user.id", "=", id)
        .executeTakeFirst()
      return user ?? null
    },
    async account({ providerAccountId, provider }) {
      const account = await db
        .selectFrom("account")
        .selectAll()
        .where("providerAccountId", "=", providerAccountId)
        .where("provider", "=", provider)
        .executeTakeFirst()

      if (account) {
        account.expires_at = Number(account?.expires_at)
        return account
      }
      return null
    },
    async session(sessionToken) {
      const session = await db
        .selectFrom("session")
        .selectAll("session")
        .where("sessionToken", "=", sessionToken)
        .executeTakeFirst()
      return session ?? null
    },
    async verificationToken({ token, identifier }) {
      const verificationToken = await db
        .selectFrom("VerificationToken")
        .selectAll()
        .where("identifier", "=", identifier)
        .where("token", "=", token)
        .executeTakeFirst()
      if (!verificationToken) return null
      return verificationToken
    },
  }
}
