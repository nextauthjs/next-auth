import { runBasicTests } from "utils/adapter"
import { XataClient } from "../src/xata"
import { XataAdapter } from "../src"

const client = new XataClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.XATA_DATABASE_URL,
})

runBasicTests({
  adapter: XataAdapter(client),
  db: {
    async user(id: string) {
      const data = await client.db.nextauth_users.filter({ id }).getFirst()
      if (!data) return null
      return data
    },
    async account({ provider, providerAccountId }) {
      const data = await client.db.nextauth_accounts
        .filter({ provider, providerAccountId })
        .getFirst()
      if (!data) return null
      return data
    },
    async session(sessionToken) {
      const data = await client.db.nextauth_sessions
        .filter({ sessionToken })
        .getFirst()
      if (!data) return null
      return data
    },
    async verificationToken(where) {
      const data = await client.db.nextauth_verificationTokens
        .filter(where)
        .getFirst()
      if (!data) return null
      return data
    },
  },
})
