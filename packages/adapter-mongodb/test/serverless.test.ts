import { runBasicTests } from "utils/adapter"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import { MongoClient } from "mongodb"
import { expect, test, vi } from "vitest"

const name = "serverless-test"
const clientPromise = new MongoClient(
  `mongodb://localhost:27017/${name}`
).connect()

const onClose = vi.fn(async (client: MongoClient) => {
  await client.close()
})

let mongoClientCount = 0

runBasicTests({
  adapter: MongoDBAdapter(
    async () => {
      const client = await new MongoClient(
        `mongodb://localhost:27017/${name}`
      ).connect()
      mongoClientCount++
      return client
    },
    {
      onClose,
    }
  ),
  db: {
    async disconnect() {
      const client = await clientPromise
      await client.db().dropDatabase()
      await client.close()
    },
    async user(id) {
      const client = await clientPromise
      const user = await client
        .db()
        .collection(defaultCollections.Users)
        .findOne({ _id: _id(id) })

      if (!user) return null
      return format.from(user)
    },
    async account(provider_providerAccountId) {
      const client = await clientPromise
      const account = await client
        .db()
        .collection(defaultCollections.Accounts)
        .findOne(provider_providerAccountId)
      if (!account) return null
      return format.from(account)
    },
    async session(sessionToken) {
      const client = await clientPromise
      const session = await client
        .db()
        .collection(defaultCollections.Sessions)
        .findOne({ sessionToken })
      if (!session) return null
      return format.from(session)
    },
    async verificationToken(identifier_token) {
      const client = await clientPromise
      const token = await client
        .db()
        .collection(defaultCollections.VerificationTokens)
        .findOne(identifier_token)
      if (!token) return null
      const { _id, ...rest } = token
      return rest
    },
  },
})

test("all the connections are closed", () => {
  expect(mongoClientCount).toBeGreaterThan(0)
  expect(onClose).toHaveBeenCalledTimes(mongoClientCount)
})
