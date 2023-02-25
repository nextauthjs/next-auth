import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import { ulid } from "ulid"

type PouchdbDocument<T> = PouchDB.Core.ExistingDocument<{ data: T }>
type PouchdbFindResponse = PouchDB.Find.FindResponse<any>

interface PouchDBAdapterConfig {
  prefixes?: AdapterDocument
  indexes?: AdapterDocument
}

interface AdapterDocument {
  user: string
  account: string
  session: string
  verificationToken: string
}

export const createIndexes = async (
  pouchdb: PouchDB.Database,
  indexConfig: AdapterDocument
) => {
  const {
    user = "nextAuthUserByEmail",
    account = "nextAuthAccountByProviderId",
    session = "nextAuthSessionByToken",
    verificationToken = "nextAuthVerificationRequestByToken",
  } = indexConfig
  await Promise.allSettled([
    await pouchdb.createIndex({
      index: {
        name: user,
        ddoc: user,
        fields: ["data.email"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: account,
        ddoc: account,
        fields: ["data.providerId", "data.providerAccountId"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: session,
        ddoc: session,
        fields: ["data.sessionToken"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: verificationToken,
        ddoc: verificationToken,
        fields: ["data.identifier", "data.token"],
      },
    }),
  ])

  return pouchdb
}

export const PouchDBAdapter = ({
  prefixes,
  indexes,
  ...pouchdb
}: PouchDB.Database & PouchDBAdapterConfig): Adapter => {
  const {
    user: userPrefix = "USER",
    account: accountPrefix = "ACCOUNT",
    session: sessionPrefix = "SESSION",
    verificationToken: verificationTokenPrefix = "VERIFICATION-TOKEN",
  } = prefixes ?? {}
  return {
    async createUser(user) {
      const doc = { ...user, _id: [userPrefix, ulid()].join("_") }
      await pouchdb.put(doc)
      return { ...user, id: doc._id }
    },

    async getUser(id) {
      const res: PouchdbDocument<AdapterUser> = await pouchdb.get(id)
      if (typeof res.data?.emailVerified === "string") {
        res.data.emailVerified = new Date(res.data.emailVerified)
      }

      console.log({ res })
      return res?.data ?? null
    },

    async getUserByEmail(email) {
      const res: PouchdbFindResponse = await pouchdb.find({
        use_index: userPrefix,
        selector: { "data.email": { $eq: email } },
        limit: 1,
      })
      const userDoc: PouchdbDocument<AdapterUser> = res.docs[0]
      if (userDoc?.data) {
        const user = userDoc.data
        if (typeof user.emailVerified === "string")
          user.emailVerified = new Date(user.emailVerified)
        return user
      }
      return null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const res: PouchdbFindResponse = await pouchdb.find({
        use_index: accountPrefix,
        selector: {
          "data.providerId": { $eq: provider },
          "data.providerAccountId": { $eq: providerAccountId },
        },
        limit: 1,
      })
      const accountDoc: PouchdbDocument<AdapterAccount> = res.docs[0]
      if (accountDoc?.data) {
        const userDoc: PouchdbDocument<AdapterUser> = await pouchdb.get(
          accountDoc.data.userId
        )
        return userDoc?.data ?? null
      }
      return null
    },

    async updateUser(user) {
      const update = { ...user }
      const doc: PouchdbDocument<AdapterUser> = await pouchdb.get(user.id!)
      doc.data = {
        ...doc.data,
        ...update,
      }
      await pouchdb.put(doc)
      return doc.data
    },

    async deleteUser(id) {
      const doc: PouchdbDocument<AdapterUser> = await pouchdb.get(id)
      await pouchdb.put({
        ...doc,
        _deleted: true,
      })
    },

    async linkAccount(account) {
      await pouchdb.put({
        _id: [account, ulid()].join("_"),
        data: account,
      })
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const _account = await pouchdb.find({
        use_index: accountPrefix,
        selector: {
          "data.providerId": { $eq: provider },
          "data.providerAccountId": { $eq: providerAccountId },
        },
        limit: 1,
      })
      await pouchdb.put({
        ..._account.docs[0],
        _deleted: true,
      })
    },

    async createSession(data) {
      await pouchdb.put({
        _id: [sessionPrefix, ulid()].join("_"),
        data,
      })
      return data
    },

    async getSessionAndUser(sessionToken) {
      const res: PouchdbFindResponse = await pouchdb.find({
        use_index: sessionPrefix,
        selector: {
          "data.sessionToken": { $eq: sessionToken },
        },
        fields: ["data", "user"],
        limit: 1,
      })

      const sessionDoc: PouchdbDocument<
        AdapterSession & { user: AdapterUser }
      > = res.docs[0]
      if (sessionDoc?.data) {
        const { user, ...session } = sessionDoc.data
        return { session, user }
      }
      return null
    },

    async updateSession(data) {
      const res: PouchdbFindResponse = await pouchdb.find({
        use_index: sessionPrefix,
        selector: {
          "data.sessionToken": { $eq: data.sessionToken },
        },
        limit: 1,
      })
      const previousSessionDoc: PouchdbDocument<AdapterSession> = res.docs[0]
      if (previousSessionDoc?.data) {
        const currentSessionDoc: PouchdbDocument<AdapterSession> = {
          ...previousSessionDoc,
          data: {
            ...previousSessionDoc.data,
            ...data,
          },
        }
        await pouchdb.put(currentSessionDoc)
        return currentSessionDoc.data
      }
      return null
    },

    async deleteSession(sessionToken) {
      const res = await pouchdb.find({
        use_index: sessionPrefix,
        selector: {
          "data.sessionToken": { $eq: sessionToken },
        },
        limit: 1,
      })
      const sessionDoc = res.docs[0]
      await pouchdb.put({
        ...sessionDoc,
        _deleted: true,
      })
    },

    async createVerificationToken(data) {
      await pouchdb.put({
        _id: [verificationTokenPrefix, ulid()].join("_"),
        ...data,
      })

      return data
    },

    async useVerificationToken({ identifier, token }) {
      const res = await pouchdb.find({
        use_index: verificationTokenPrefix,
        selector: {
          "data.identifier": { $eq: identifier },
          "data.token": { $eq: token },
        },
        limit: 1,
      })
      const verificationRequestDoc = res
        .docs[0] as PouchdbDocument<VerificationToken>
      await pouchdb.put({
        ...verificationRequestDoc,
        _deleted: true,
      })
      return verificationRequestDoc.data
    },
  }
}
