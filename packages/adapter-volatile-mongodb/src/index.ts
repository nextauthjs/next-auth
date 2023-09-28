/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://www.mongodb.com">MongoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.mongodb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/mongodb.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/volatile-mongodb-adapter mongodb
 * ```
 *
 * @module @auth/volatile-mongodb-adapter
 */
import { ObjectId } from "mongodb"

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import type { MongoClient } from "mongodb"

/** This is the interface of the MongoDB adapter options. */
export interface VolatileMongoDBAdapterOptions {
  /**
   * The name of the {@link https://www.mongodb.com/docs/manual/core/databases-and-collections/#collections MongoDB collections}.
   */
  collections?: {
    Users?: string
    Accounts?: string
    Sessions?: string
    VerificationTokens?: string
  }
  /**
   * The name you want to give to the MongoDB database
   */
  databaseName?: string
}

export interface VolatileMongoClientWrapper {
  client: MongoClient
  /** User defined close function */
  close: () => Promise<void> | void
}

export const defaultCollections: Required<
  Required<VolatileMongoDBAdapterOptions>["collections"]
> = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
}

export const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (key === "_id") {
        newObject.id = value.toHexString()
      } else if (key === "userId") {
        newObject[key] = value.toHexString()
      } else {
        newObject[key] = value
      }
    }
    return newObject as T
  },
  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to<T = Record<string, unknown>>(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {
      _id: _id(object.id),
    }
    for (const key in object) {
      const value = object[key]
      if (key === "userId") newObject[key] = _id(value)
      else if (key === "id") continue
      else newObject[key] = value
    }
    return newObject as T & { _id: ObjectId }
  },
}

/** @internal */
export function _id(hex?: string) {
  if (hex?.length !== 24) return new ObjectId()
  return new ObjectId(hex)
}

/**
 * ## Setup
 *
 * The Volatile MongoDB adapter does not handle connections automatically, so you will have to make sure that you pass the Adapter a `MongoClient creator`. Below you can see an example how to do this.
 *
 * ### Add the MongoDB client
 *
 * ```ts
 * // This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
 * import { MongoClient } from "mongodb"
 * import { VolatileMongoClientWrapper } from "@auth/volatile-mongodb-adapter"
 *
 * if (!process.env.MONGODB_URI) {
 *   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
 * }
 *
 * const uri = process.env.MONGODB_URI
 * const options = {}
 *
 * let createClient: () => Promise<VolatileMongoClientWrapper>
 *
 * if (process.env.NODE_ENV === "development") {
 *   // In development mode, use a global variable so that the value
 *   // is preserved across module reloads caused by HMR (Hot Module Replacement).
 *   if (!global._mongoClientPromise) {
 *     const client = new MongoClient(uri, options)
 *     global._mongoClientPromise = client.connect()
 *   }
 *   createClient = () => ({ client: global._mongoClientPromise, close: () => {} })
 * } else {
 *   // In production mode, it's best to not use a global variable.
 *   createClient = async () => {
 *     const client = new MongoClient(uri, options)
 *     await client.connect()
 *     return { client, close: () => client.close() }
 *   }
 * }
 *
 * // Export a module-scoped MongoClient promise. By doing this in a
 * // separate module, the client can be shared across functions.
 * export default createClient
 * ```
 *
 * ### Configure Auth.js
 *
 * ```js
 * import NextAuth from "next-auth"
 * import { VolatileMongoDBAdapter } from "@auth/volatile-mongodb-adapter"
 * import createClient from "../../../lib/mongodb"
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/providers/oauth
 * export default NextAuth({
 *   adapter: VolatileMongoDBAdapter(createClient),
 *   ...
 * })
 * ```
 **/
export function VolatileMongoDBAdapter(
  createClient: () => Promise<VolatileMongoClientWrapper>,
  options: VolatileMongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options
  const { from, to } = format

  const createDb = async () => {
    const { client, close } = await createClient()
    const _db = client.db(options.databaseName)
    const c = { ...defaultCollections, ...collections }
    return {
      U: _db.collection<AdapterUser>(c.Users),
      A: _db.collection<AdapterAccount>(c.Accounts),
      S: _db.collection<AdapterSession>(c.Sessions),
      V: _db.collection<VerificationToken>(c?.VerificationTokens),
      close,
    }
  }

  return {
    async createUser(data) {
      const user = to<AdapterUser>(data)
      const db = await createDb()
      try {
        await db.U.insertOne(user)
        return from<AdapterUser>(user)
      } finally {
        await db.close()
      }
    },
    async getUser(id) {
      const db = await createDb()
      try {
        const user = await db.U.findOne({ _id: _id(id) })
        if (!user) return null
        return from<AdapterUser>(user)
      } finally {
        await db.close()
      }
    },
    async getUserByEmail(email) {
      const db = await createDb()
      try {
        const user = await db.U.findOne({ email })
        if (!user) return null
        return from<AdapterUser>(user)
      } finally {
        await db.close()
      }
    },
    async getUserByAccount(provider_providerAccountId) {
      const db = await createDb()
      try {
        const account = await db.A.findOne(provider_providerAccountId)
        if (!account) return null
        const user = await (
          await db
        ).U.findOne({ _id: new ObjectId(account.userId) })
        if (!user) return null
        return from<AdapterUser>(user)
      } finally {
        await db.close()
      }
    },
    async updateUser(data) {
      const { _id, ...user } = to<AdapterUser>(data)
      const db = await createDb()

      try {
        const result = await db.U.findOneAndUpdate(
          { _id },
          { $set: user },
          { returnDocument: "after" }
        )

        return from<AdapterUser>(result!)
      } finally {
        await db.close()
      }
    },
    async deleteUser(id) {
      const userId = _id(id)
      const db = await createDb()
      try {
        await Promise.all([
          db.A.deleteMany({ userId: userId as any }),
          db.S.deleteMany({ userId: userId as any }),
          db.U.deleteOne({ _id: userId }),
        ])
      } finally {
        await db.close()
      }
    },
    linkAccount: async (data) => {
      const account = to<AdapterAccount>(data)
      const db = await createDb()
      try {
        await db.A.insertOne(account)
        return account
      } finally {
        await db.close()
      }
    },
    async unlinkAccount(provider_providerAccountId) {
      const db = await createDb()
      try {
        const account = await db.A.findOneAndDelete(provider_providerAccountId)
        return from<AdapterAccount>(account!)
      } finally {
        await db.close()
      }
    },
    async getSessionAndUser(sessionToken) {
      const db = await createDb()
      try {
        const session = await db.S.findOne({ sessionToken })
        if (!session) return null
        const user = await (
          await db
        ).U.findOne({ _id: new ObjectId(session.userId) })
        if (!user) return null
        return {
          user: from<AdapterUser>(user),
          session: from<AdapterSession>(session),
        }
      } finally {
        await db.close()
      }
    },
    async createSession(data) {
      const session = to<AdapterSession>(data)
      const db = await createDb()
      try {
        await db.S.insertOne(session)
        return from<AdapterSession>(session)
      } finally {
        await db.close()
      }
    },
    async updateSession(data) {
      const { _id, ...session } = to<AdapterSession>(data)
      const db = await createDb()
      try {
        const updatedSession = await db.S.findOneAndUpdate(
          { sessionToken: session.sessionToken },
          { $set: session },
          { returnDocument: "after" }
        )
        return from<AdapterSession>(updatedSession!)
      } finally {
        await db.close()
      }
    },
    async deleteSession(sessionToken) {
      const db = await createDb()
      try {
        const session = await db.S.findOneAndDelete({
          sessionToken,
        })
        return from<AdapterSession>(session!)
      } finally {
        await db.close()
      }
    },
    async createVerificationToken(data) {
      const db = await createDb()
      try {
        await db.V.insertOne(to(data))
        return data
      } finally {
        await db.close()
      }
    },
    async useVerificationToken(identifier_token) {
      const db = await createDb()
      try {
        const verificationToken = await db.V.findOneAndDelete(identifier_token)

        if (!verificationToken) return null
        const { _id, ...rest } = verificationToken
        return rest
      } finally {
        await db.close()
      }
    },
  }
}
