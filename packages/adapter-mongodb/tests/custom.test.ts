import { runBasicTests } from "utils/adapter"
import { defaultCollections, format, MongoDBAdapter, _id } from "../src"
import { MongoClient } from "mongodb"
const name = "custom-test"
const client = new MongoClient(`mongodb://localhost:27017/${name}`)
const clientPromise = client.connect()

const collections = { ...defaultCollections, Users: "some_userz" }

runBasicTests({
  adapter: MongoDBAdapter(clientPromise, {
    collections,
  }),
  db: {
    async disconnect() {
      await client.db().dropDatabase()
      await client.close()
    },
    async user(id) {
      return format.from(
        await client
          .db()
          .collection(collections.Users)
          .findOne({ _id: _id(id) }),
        true
      )
    },
    async account(provider_providerAccountId) {
      return format.from(
        await client
          .db()
          .collection(collections.Accounts)
          .findOne(provider_providerAccountId)
      )
    },
    async session(sessionToken) {
      return format.from(
        await client
          .db()
          .collection(collections.Sessions)
          .findOne({ sessionToken })
      )
    },
    async verificationToken(identifier_token) {
      return format.from(
        await client
          .db()
          .collection(collections.VerificationTokens)
          .findOne(identifier_token)
      )
    },
  },
})
