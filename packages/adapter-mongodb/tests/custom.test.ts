import { runBasicTests } from "adapter-test"
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
      const user = await client
        .db()
        .collection(collections.Users)
        .findOne({ _id: _id(id) })

      if (!user) return null
      return format.from(user)
    },
    async account(provider_providerAccountId) {
      const account = await client
        .db()
        .collection(collections.Accounts)
        .findOne(provider_providerAccountId)
      if (!account) return null
      return format.from(account)
    },
    async session(sessionToken) {
      const session = await client
        .db()
        .collection(collections.Sessions)
        .findOne({ sessionToken })
      if (!session) return null
      return format.from(session)
    },
    async verificationToken(identifier_token) {
      const token = await client
        .db()
        .collection(collections.VerificationTokens)
        .findOne(identifier_token)
      if (!token) return null
      const { _id, ...rest } = token
      return rest
    },
  },
})
