import { runBasicTests } from "utils/adapter"
import { AstraDBAdapter, format, defaultCollections, client } from "../src"
import type { AstraDBConfig } from "../src"

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

const { request } = client(api)

runBasicTests({
  adapter: AstraDBAdapter(api),
  db: {
    async connect() {
      await Promise.all(
        Object.keys(defaultCollections).map((name) =>
          request(null, { createCollection: { name } })
        )
      )
    },
    async disconnect() {
      await Promise.all(
        Object.keys(defaultCollections).map((name) =>
          request(null, { deleteCollection: { name } })
        )
      )
    },
    async session(sessionToken) {
      return format.from(
        await request(sessions, { findOne: { filter: { sessionToken } } })
      )
    },
    async user(_id: string) {
      return format.from(
        await request(users, { findOne: { filter: { _id } } }),
        true
      )
    },
    async account(filter) {
      return format.from(await request(accounts, { findOne: { filter } }))
    },
    async verificationToken(filter) {
      return format.from(await request(tokens, { findOne: { filter } }))
    },
  },
})
