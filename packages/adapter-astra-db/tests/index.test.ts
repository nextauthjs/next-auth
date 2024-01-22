import { runBasicTests } from "utils/adapter"
import { AstraDBAdapter, format, defaultCollections } from "../src"
import type { AstraDBConfig } from "../src"
import { AstraDB } from "@datastax/astra-db-ts"

jest.setTimeout(30000) // Collection creation might be slow

const api = {
  dbId: process.env.ASTRA_DB_ID,
  token: process.env.ASTRA_DB_APPLICATION_TOKEN,
  region: "us-east-2",
  keyspace: "test",
} satisfies AstraDBConfig

const baseUrl = `https://${api.dbId}-${api.region}.apps.astra.datastax.com/api/json/v1/${api.keyspace}`

const sessions = `${baseUrl}/${defaultCollections.sessions}`
const users = `${baseUrl}/${defaultCollections.users}`
const accounts = `${baseUrl}/${defaultCollections.accounts}`
const tokens = `${baseUrl}/${defaultCollections.verificationTokens}`

const astra = new AstraDB(api.token, api.dbId, api.region, api.keyspace)

runBasicTests({
  adapter: AstraDBAdapter(api),
  db: {
    async connect() {
      for await (const name of Object.keys(defaultCollections))
        await astra.createCollection(name)
    },
    async disconnect() {
      for await (const name of Object.keys(defaultCollections))
        await astra.dropCollection(name)
    },
    async user(_id: string) {
      const collection = await astra.collection(users)
      return format.from(await collection.findOne({ _id }), true)
    },
    async account(filter) {
      const collection = await astra.collection(accounts)
      return format.from(await collection.findOne({ filter }))
    },
    async session(sessionToken) {
      const collection = await astra.collection(sessions)
      return format.from(await collection.findOne({ filter: { sessionToken } }))
    },
    async verificationToken(filter) {
      const collection = await astra.collection(tokens)
      return format.from(await collection.findOne({ filter }))
    },
  },
})
