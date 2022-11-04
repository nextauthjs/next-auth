import "isomorphic-fetch"
import { runBasicTests } from "@next-auth/adapter-test"
import "dotenv/config"
import { XataClient } from "../src/xata"
import { XataAdapter } from "../src"

if (!process.env.XATA_API_KEY) {
  test("Skipping XataAdapter tests, since required environment variables aren't available", () => {
    expect(true).toBe(true)
  })
  process.exit(0)
}

if (process.env.CI) {
  // TODO: Fix this
  test('Skipping XataAdapter tests in CI because of "Request failed" errors. Should revisit', () => {
    expect(true).toBe(true)
  })
  process.exit(0)
}

const client = new XataClient({
  apiKey: process.env.XATA_API_KEY,
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
