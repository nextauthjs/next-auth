import { runBasicTests } from "@auth/adapter-test"
import { AstraDBAdapter, format, defaultCollections } from "../src"
import type { AstraDBConfig } from "../src"

if (!process.env.ASTRA_DB_ID) throw new TypeError("ASTRA_DB_ID is missing")
if (!process.env.ASTRA_DB_APPLICATION_TOKEN)
  throw new TypeError("ASTRA_DB_APPLICATION_TOKEN is missing")

const api = {
  dbId: process.env.ASTRA_DB_ID,
  region: "us-east-2",
  keyspace: "test",
  token: process.env.ASTRA_DB_APPLICATION_TOKEN,
} satisfies AstraDBConfig["api"]

const baseUrl = `https://${api.dbId}-${api.region}.apps.astra.datastax.com/api/json/v1/${api.keyspace}`

const sessions = `${baseUrl}/${defaultCollections.sessions}`
const users = `${baseUrl}/${defaultCollections.users}`
const accounts = `${baseUrl}/${defaultCollections.accounts}`
const tokens = `${baseUrl}/${defaultCollections.verificationTokens}`

function init(body: any) {
  return {
    method: "post",
    headers: {
      "x-cassandra-token": api.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  } satisfies RequestInit
}

runBasicTests({
  adapter: AstraDBAdapter({ api }),
  db: {
    async connect() {
      await Promise.all(
        Object.keys(defaultCollections).map((name) =>
          fetch(baseUrl, init({ createCollection: { name } }))
        )
      )
    },
    async disconnect() {
      await Promise.all(
        Object.keys(defaultCollections).map((name) =>
          fetch(baseUrl, init({ deleteCollection: { name } }))
        )
      )
    },
    async session(sessionToken) {
      return format.from(
        await fetch(
          sessions,
          init({ findOne: { filter: { sessionToken } } })
        ).then((res) => res.json())
      )
    },
    async user(_id: string) {
      return format.from(
        await fetch(users, init({ findOne: { filter: { _id } } })).then((res) =>
          res.json()
        )
      )
    },
    async account(filter) {
      return format.from(
        await fetch(accounts, init({ findOne: { filter } })).then((res) =>
          res.json()
        )
      )
    },
    async verificationToken(filter) {
      const token = format.from(
        await fetch(tokens, init({ findOne: { filter } })).then((res) =>
          res.json()
        )
      )
      delete token?.id
      return token
    },
  },
})
