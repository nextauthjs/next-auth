import { runBasicTests } from "utils/adapter/vitest"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import { MongoClient } from "mongodb"

const name = "test"
const client = new MongoClient(`mongodb://localhost:27017/${name}`)
const clientPromise = client.connect()

runBasicTests({
  adapter: MongoDBAdapter(clientPromise),
  db: {
    async disconnect() {
      await client.db().dropDatabase()
      await client.close()
    },
    async user(id) {
      return format.from(
        await client
          .db()
          .collection(defaultCollections.Users)
          .findOne({ _id: _id(id) }),
        true
      )
    },
    async account(provider_providerAccountId) {
      return format.from(
        await client
          .db()
          .collection(defaultCollections.Accounts)
          .findOne(provider_providerAccountId)
      )
    },
    async session(sessionToken) {
      return format.from(
        await client
          .db()
          .collection(defaultCollections.Sessions)
          .findOne({ sessionToken })
      )
    },
    async verificationToken(identifier_token) {
      return format.from(
        await client
          .db()
          .collection(defaultCollections.VerificationTokens)
          .findOne(identifier_token)
      )
    },
  },
})
