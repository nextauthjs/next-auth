/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ObjectId } from "mongodb"

import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import type { MongoClient } from "mongodb"
import type { Account } from "next-auth"

export interface MongoDBAdapterOptions {
  collections?: {
    Users?: string
    Accounts?: string
    Sessions?: string
    VerificationTokens?: string
  }
}

export const defaultCollections: Required<
  Required<MongoDBAdapterOptions>["collections"]
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
      if (key === "userId") {
        newObject[key] = _id(value)
      } else {
        newObject[key] = value
      }
    }
    return newObject as T
  },
}

/** Converts from string to ObjectId */
export function _id(hex?: string) {
  if (hex?.length !== 24) return new ObjectId()
  return new ObjectId(hex)
}

export function MongoDBAdapter(
  client: Promise<MongoClient>,
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options
  const { from, to } = format

  const db = (async () => {
    const _db = (await client).db()
    const c = { ...defaultCollections, ...collections }
    return {
      U: _db.collection<AdapterUser>(c.Users),
      A: _db.collection<Account>(c.Accounts),
      S: _db.collection<AdapterSession>(c.Sessions),
      V: _db.collection<VerificationToken>(c?.VerificationTokens),
    }
  })()

  return {
    async createUser(data) {
      const user = to<AdapterUser>(data)
      await (await db).U.insertOne(user)
      return from<AdapterUser>(user)
    },
    async getUser(id) {
      const user = await (await db).U.findOne({ _id: _id(id) })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async getUserByEmail(email) {
      const user = await (await db).U.findOne({ email })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async getUserByAccount(provider_providerAccountId) {
      const account = await (await db).A.findOne(provider_providerAccountId)
      if (!account) return null
      const user = await (
        await db
      ).U.findOne({ _id: new ObjectId(account.userId) })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async updateUser(data) {
      const { value: user } = await (
        await db
      ).U.findOneAndUpdate({ _id: _id(data.id) }, { $set: data })
      return from<AdapterUser>(user!)
    },
    async deleteUser(id) {
      const userId = _id(id)
      const m = await db
      await Promise.all([
        m.A.deleteMany({ userId }),
        m.S.deleteMany({ userId }),
        m.U.deleteOne({ _id: userId }),
      ])
    },
    linkAccount: async (data) => {
      const account = to<Account>(data)
      await (await db).A.insertOne(account)
      return account
    },
    async unlinkAccount(provider_providerAccountId) {
      const { value: account } = await (
        await db
      ).A.findOneAndDelete(provider_providerAccountId)
      return from<Account>(account!)
    },
    async getSessionAndUser(sessionToken) {
      const session = await (await db).S.findOne({ sessionToken })
      if (!session) return null
      const user = await (
        await db
      ).U.findOne({ _id: new ObjectId(session.userId) })
      if (!user) return null
      return {
        user: from<AdapterUser>(user),
        session: from<AdapterSession>(session),
      }
    },
    async createSession(data) {
      const session = to<AdapterSession>(data)
      await (await db).S.insertOne(session)
      return from<AdapterSession>(session)
    },
    async updateSession(data) {
      const { value: session } = await (
        await db
      ).S.findOneAndUpdate({ sessionToken: data.sessionToken }, { $set: data })
      return from<AdapterSession>(session!)
    },
    async deleteSession(sessionToken) {
      const { value: session } = await (
        await db
      ).S.findOneAndDelete({
        sessionToken,
      })
      return from<AdapterSession>(session!)
    },
    async createVerificationToken(data) {
      await (await db).V.insertOne(to(data))
      return data
    },
    async useVerificationToken(identifier_token) {
      const { value: verificationToken } = await (
        await db
      ).V.findOneAndDelete(identifier_token)

      if (!verificationToken) return null
      // @ts-expect-error
      delete verificationToken._id
      return verificationToken
    },
  }
}
