import { FaunaAdapter, query, format } from "../src"
import { runBasicTests } from "@next-auth/adapter-test"
import { Client as FaunaClient, fql } from "fauna"

const client = new FaunaClient({
  secret: "secret",
  scheme: "http",
  domain: "localhost",
  port: 8443,
  endpoint: "http://localhost:8443",
})

const q = query(client, format.from)

runBasicTests({
  adapter: FaunaAdapter(client),
  db: {
    disconnect: async () => await client.close({ force: true }),
    user: async (id) => await q(fql`Users.byId(${id})`),
    session: async (sessionToken) =>
      await q(fql`Sessions.bySessionToken(${sessionToken})`),
    account: async ({ provider, providerAccountId }) => {
      const key = [provider, providerAccountId]
      return await q(fql`Accounts.byProviderAndProviderAccountId(${key})`)
    },
    verificationToken: async ({ identifier, token }) => {
      const key = [identifier, token]
      const verificationToken = await q(
        fql`VerificationTokens.byIdentifierAndToken(${key})`
      )
      // @ts-expect-error
      if (verificationToken) delete verificationToken.id
      return verificationToken
    },
  },
})
