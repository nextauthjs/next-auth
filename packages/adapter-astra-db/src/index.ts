/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://astra.datastax.com/">Astra DB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://astra.datastax.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/astra-db.png" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/astra-db-adapter
 * ```
 *
 * @module @auth/astra-db-adapter
 */

import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

export interface AstraDBConfig {
  dbId?: string
  /** @see https://docs.datastax.com/en/astra-serverless/docs/plan/regions.html */
  /** @default "us-east-2" */
  region?:
    | "ap-east-1"
    | "ap-south-1"
    | "ap-southeast-1"
    | "ap-southeast-2"
    | "asia-northeast1"
    | "asia-south1"
    | "australia-southeast1"
    | "eu-central-1"
    | "eu-west-1"
    | "eu-west-2"
    | "europe-west1"
    | "europe-west2"
    | "europe-west3"
    | "europe-west4"
    | "northamerica-northeast1"
    | "northamerica-northeast2"
    | "sa-east-1"
    | "us-central1"
    | "us-east-1"
    | "us-east-2"
    | "us-east1"
    | "us-east4"
    | "us-west-2"
    | "us-west1"
    | "us-west4"
  /** @default authjs*/
  keyspace?: string
  token?: string
  collections?: {
    users?: string
    sessions?: string
    accounts?: string
    verificationTokens?: string
  }
}

export const defaultCollections = {
  users: "users",
  sessions: "sessions",
  accounts: "accounts",
  verificationTokens: "verificationTokens",
} satisfies AstraDBConfig["collections"]

interface AstraResponse<T> {
  data?: { document: T | null }
  errors: { message: string; errorCode: string }[]
  status: any
}

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

function isDate(value: unknown): value is string | number {
  if (typeof value !== "string") return false
  return isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export const format = {
  /** Takes a DB response and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(
    object: AstraResponse<T>,
    /** If set to `true` the `id` property is not stripped. */
    includeId: boolean = false
  ): T | null {
    if (object.errors?.length) {
      const e = new Error(object.errors[0].message)
      e.cause = object.errors
      throw e
    }

    if (!object.data?.document) return null

    const newObject: Record<string, unknown> = {}
    for (const key in object.data.document) {
      const value = object.data.document[key]
      if (key === "_id") newObject["id"] = value
      else if (isDate(value)) newObject[key] = new Date(value)
      else newObject[key] = value
    }
    if (!includeId) delete newObject.id
    return newObject as T
  },
}

/** Fetch data from the DataStax API */
export function client(api: AstraDBConfig) {
  const { dbId, region = "us-east-2", token, keyspace = "authjs" } = api
  if (!dbId) throw new TypeError("Astra DB Adapter is mising `dbId`")
  if (!region) throw new TypeError("Astra DB Adapter is mising `region`")
  if (!token) throw new TypeError("Astra DB Adapter is mising `token`")

  const baseUrl = `https://${dbId}-${region}.apps.astra.datastax.com/api/json/v1/${keyspace}`
  return {
    async request(collection: string | null, data: unknown) {
      const url = new URL(`${baseUrl}/${collection ?? ""}`)
      return await fetch(url.href.replace(/\/$/, ""), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cassandra-token": token,
        },
        body: JSON.stringify(data),
      }).then((res) => res.json())
    },
  }
}

/**
 * ## Setup
 *
 * Require the necessary collections in the Cassandra Database:
 * "users"
 * "sessions"
 * "accounts"
 * "tokens"
 *
 * :::note
 * You might not need all of these collections, based on your requirements. [Learn more](https://authjs.dev/guides/adapters/creating-a-database-adapter).
 * :::
 *
 * To create the required collections, you can use cURL for example:
 *
 * ```bash
 * #!/bin/bash
 * export ASTRA_DB_ID="6ab0646e-c8d3-4976-8b0e-8b48e3144725"
 * export ASTRA_DB_REGION="eu-west-1"
 * export ASTRA_DB_KEYSPACE="authjs"
 * export ASTRA_DB_APPLICATION_TOKEN="AstraCS:PZXoTjamJFkjmkWcAQSAPwGd:61ed0a6c81f437dedcbdd04c23b96b006cdf05973d0c671952454bd23c6f456c"
 * export ASTRA_URL="https://$ASTRA_DB_ID-$ASTRA_DB_REGION.apps.astra.datastax.com/api/json/v1/$ASTRA_DB_KEYSPACE"
 * collections=("users" "accounts" "sessions" "tokens")
 * for collection in "${collections[@]}"
 * do
 *   curl -X POST "$ASTRA_URL" \
 *       -H "x-cassandra-token: $ASTRA_DB_APPLICATION_TOKEN" \
 *       -H "Content-Type: application/json" \
 *       -d "{\"createCollection\": {\"name\": \"$collection\"}}"
 * done
 * ```
 *
 * ```ts
 * import NextAuth from "next-auth"
 * import { AstraDBAdapter } from "@auth/astra-db-adapter"
 *
 * export default NextAuth({
 *   adapter: AstraDBAdapter({
 *     dbId: process.env.ASTRA_DB_ID,
 *     token: process.env.ASTRA_DB_APPLICATION_TOKEN,
 *     region: "eu-west-1",
 *     keyspace: "authjs",
 *   }),
 * })
 * ```
 */
export function AstraDBAdapter(config: AstraDBConfig): Adapter {
  const { collections: _collections, ...api } = config
  const collections = { ...defaultCollections, ..._collections }
  const { users, accounts, sessions, verificationTokens: tokens } = collections
  const { request } = client(api)

  return {
    async createUser(user) {
      await request(users, {
        findOneAndUpdate: {
          filter: { email: user.email },
          update: { $set: user },
          options: { returnDocument: "after", upsert: true },
        },
      })
      return user
    },
    async getUser(id) {
      return format.from(
        await request(users, { findOne: { filter: { _id: id } } }),
        true
      )
    },
    async getUserByEmail(email) {
      return format.from(
        await request(users, { findOne: { filter: { email } } }),
        true
      )
    },
    async getUserByAccount(filter) {
      const account = format.from(
        await request(accounts, { findOne: { filter } })
      )
      if (!account) return null

      return format.from(
        await request(users, { findOne: { filter: { _id: account.userId } } }),
        true
      )
    },
    async updateUser(user) {
      const { id: _id, ...rest } = user
      return format.from(
        await request(users, {
          findOneAndUpdate: {
            filter: { _id },
            update: { $set: rest },
            options: { returnDocument: "after", upsert: false },
          },
        }),
        true
      )!
    },
    async deleteUser(userId) {
      const requests = [
        request(users, { deleteMany: { filter: { _id: userId } } }),
        request(accounts, { deleteMany: { filter: { userId } } }),
        request(sessions, { deleteMany: { filter: { userId } } }),
      ]
      return format.from<AdapterUser>((await Promise.all(requests))[0])
    },
    async linkAccount(account) {
      await request(accounts, { insertOne: { document: account } })
      return account
    },
    async unlinkAccount(filter) {
      const requests = [
        request(accounts, { findOne: { filter } }),
        request(accounts, { deleteMany: { filter } }),
      ]
      return format.from<AdapterAccount>((await Promise.all(requests))[0])!
    },
    async createSession(session) {
      await request(sessions, { insertOne: { document: session } })
      return session
    },
    async getSessionAndUser(sessionToken) {
      const session = format.from<AdapterSession>(
        await request(sessions, { findOne: { filter: { sessionToken } } })
      )

      if (!session) return null

      const user = format.from<AdapterUser>(
        await request(users, { findOne: { filter: { _id: session.userId } } }),
        true
      )

      if (!user) return null

      return { session, user }
    },
    async updateSession(session) {
      const { sessionToken } = session
      return format.from(
        await request(sessions, {
          findOneAndUpdate: {
            filter: { sessionToken },
            update: { $set: session },
            options: { returnDocument: "after", upsert: false },
          },
        })
      )
    },
    async deleteSession(sessionToken) {
      const requests = [
        request(sessions, { findOne: { filter: { sessionToken } } }),
        request(sessions, { deleteOne: { filter: { sessionToken } } }),
      ]

      return format.from<AdapterSession>((await Promise.all(requests))[0])
    },
    async createVerificationToken(verificationToken) {
      await request(tokens, { insertOne: { document: verificationToken } })
      return verificationToken
    },
    async useVerificationToken(filter) {
      const requests = [
        request(tokens, { findOne: { filter } }),
        request(tokens, { deleteMany: { filter } }),
      ]
      return format.from<VerificationToken>((await Promise.all(requests))[0])
    },
  }
}
