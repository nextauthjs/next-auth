import { runBasicTests } from "utils/adapter"
import { TriplitAdapter } from "../src"
import { RemoteClient } from "@triplit/client"
import { schema } from "../triplit/schema"

const server = "http://localhost:6543"
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4LXRyaXBsaXQtdG9rZW4tdHlwZSI6InNlY3JldCIsIngtdHJpcGxpdC1wcm9qZWN0LWlkIjoibG9jYWwtcHJvamVjdC1pZCJ9.8Z76XXPc9esdlZb2b7NDC7IVajNXKc4eVcPsO7Ve0ug"

const client = new RemoteClient({
  server,
  token,
  schema,
})

runBasicTests({
  adapter: TriplitAdapter({
    server,
    token,
    schema,
  }),
  db: {
    async session(sessionToken) {
      const session =
        (await client.fetchOne({
          collectionName: "sessions",
          where: [["sessionToken", "=", sessionToken]],
        })) ?? null
      return session
    },
    async user(id) {
      const user = (await client.fetchById("users", id)) ?? null
      return user
    },
    async account({ provider, providerAccountId }) {
      const account =
        (await client.fetchOne({
          collectionName: "accounts",
          where: [
            ["provider", "=", provider],
            ["providerAccountId", "=", providerAccountId],
          ],
        })) ?? null
      return account
    },
    async verificationToken({ identifier, token }) {
      const verificationToken =
        (await client.fetchOne({
          collectionName: "verificationTokens",
          where: [
            ["identifier", "=", identifier],
            ["token", "=", token],
          ],
          select: ["expires", "identifier", "token"],
        })) ?? null
      return verificationToken
    },
  },
})
