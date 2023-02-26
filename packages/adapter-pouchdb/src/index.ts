import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import { ulid } from "ulid"

type PrefixConfig = Record<
  "user" | "account" | "session" | "verificationToken",
  string
>
type IndexConfig = Record<
  | "userByEmail"
  | "userById"
  | "accountByProviderId"
  | "sessionByToken"
  | "verificationTokenByToken",
  string
>
interface PouchDBAdapterConfig {
  prefixes?: PrefixConfig
  indexes?: IndexConfig
}

export const createIndexesPouchDBAdapter = async (
  pouchdb: PouchDB.Database,
  indexes?: IndexConfig
) => {
  const {
    userByEmail = "nextAuthUserByEmail",
    userById = "nextAuthUserById",
    accountByProviderId = "nextAuthAccountByProviderId",
    sessionByToken = "nextAuthSessionByToken",
    verificationTokenByToken = "nextAuthVerificationRequestByToken",
  } = indexes ?? {}
  await Promise.allSettled([
    await pouchdb.createIndex({
      index: {
        name: userByEmail,
        ddoc: userByEmail,
        fields: ["email"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: userById,
        ddoc: userById,
        fields: ["id"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: accountByProviderId,
        ddoc: accountByProviderId,
        fields: ["provider", "providerAccountId"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: sessionByToken,
        ddoc: sessionByToken,
        fields: ["sessionToken"],
      },
    }),
    await pouchdb.createIndex({
      index: {
        name: verificationTokenByToken,
        ddoc: verificationTokenByToken,
        fields: ["identifier", "token"],
      },
    }),
  ])
}

/** @internal */
const toAdapter = <T>(
  dbObject: T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) => {
  const {
    _id,
    _rev,
    _conflicts,
    _attachments,
    _revisions,
    _revs_info,
    ...rest
  } = dbObject
  return rest
}

/** @internal */
export const toAdapterUser = (
  user: AdapterUser & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) => {
  if (typeof user?.emailVerified === "string")
    user.emailVerified = new Date(user.emailVerified)
  return { ...toAdapter(user), id: user._id }
}

/** @internal */
export const toAdapterSession = (
  session: AdapterSession & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) => {
  if (typeof session?.expires === "string")
    session.expires = new Date(session.expires)
  return { ...toAdapter(session), id: session._id }
}

/** @internal */
export const toAdapterAccount = (
  account: AdapterAccount & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) => {
  return { ...toAdapter(account), id: account._id }
}

/** @internal */
export const toVerificationToken = (
  verificationToken: VerificationToken &
    PouchDB.Core.IdMeta &
    PouchDB.Core.GetMeta
) => {
  if (typeof verificationToken?.expires === "string")
    verificationToken.expires = new Date(verificationToken.expires)
  return { ...toAdapter(verificationToken) }
}

export const PouchDBAdapter = ({
  config,
  pouchdb,
}: {
  pouchdb: PouchDB.Database
  config?: PouchDBAdapterConfig
}): Adapter => {
  const {
    userByEmail = "nextAuthUserByEmail",
    accountByProviderId = "nextAuthAccountByProviderId",
    sessionByToken = "nextAuthSessionByToken",
    verificationTokenByToken = "nextAuthVerificationRequestByToken",
  } = config?.indexes ?? {}
  const {
    user: userPrefix = "USER",
    account: accountPrefix = "ACCOUNT",
    session: sessionPrefix = "SESSION",
    verificationToken: verificationTokenPrefix = "VERIFICATION-TOKEN",
  } = config?.prefixes ?? {}
  return {
    async createUser(user) {
      const doc = { ...user, _id: [userPrefix, ulid()].join("_") }
      await pouchdb.put(doc)
      return { ...user, id: doc._id }
    },

    async getUser(id) {
      try {
        const res = await pouchdb.get<AdapterUser>(id)
        return toAdapterUser(res)
      } catch {
        return null
      }
    },

    async getUserByEmail(email) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterUser>
      ).find({
        use_index: userByEmail,
        selector: { email: { $eq: email } },
        limit: 1,
      })
      const userDoc = res.docs[0]
      if (userDoc) {
        return toAdapterUser(userDoc)
      }
      return null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterAccount>
      ).find({
        use_index: accountByProviderId,
        selector: {
          provider: { $eq: provider },
          providerAccountId: { $eq: providerAccountId },
        },
        limit: 1,
      })
      const account = res.docs[0]
      if (account) {
        const user = await (
          pouchdb as unknown as PouchDB.Database<AdapterUser>
        ).get(account.userId)
        return toAdapterUser(user) ?? null
      }
      return null
    },

    async updateUser(user) {
      const doc = await (
        pouchdb as unknown as PouchDB.Database<AdapterUser>
      ).get(user.id!)
      const newUser = {
        ...doc,
        ...user,
      }
      await pouchdb.put(newUser)
      return toAdapterUser(newUser)
    },

    /** @todo Implement */
    async deleteUser(id) {},

    async linkAccount(account) {
      const doc = { ...account, _id: [accountPrefix, ulid()].join("_") }
      await (pouchdb as unknown as PouchDB.Database<AdapterAccount>).put(doc)

      return { ...account, id: doc._id }
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const _account = await (
        pouchdb as unknown as PouchDB.Database<AdapterAccount>
      ).find({
        use_index: accountByProviderId,
        selector: {
          provider: { $eq: provider },
          providerAccountId: { $eq: providerAccountId },
        },
        limit: 1,
      })
      await pouchdb.put({
        ..._account.docs[0],
        _deleted: true,
      })
    },

    async createSession(data) {
      const doc = {
        _id: [sessionPrefix, ulid()].join("_"),
        ...data,
      }
      await (pouchdb as unknown as PouchDB.Database<AdapterSession>).put(doc)
      return { ...data, id: doc._id }
    },

    async getSessionAndUser(sessionToken) {
      const session = (
        await (
          pouchdb as unknown as PouchDB.Database<
            AdapterSession & { user: AdapterUser }
          >
        ).find({
          use_index: sessionByToken,
          selector: {
            sessionToken: { $eq: sessionToken },
          },
          limit: 1,
        })
      ).docs[0]

      if (session) {
        const user = await (
          pouchdb as unknown as PouchDB.Database<AdapterUser>
        ).get(session.userId)
        return { session: toAdapterSession(session), user: toAdapterUser(user) }
      }
      return null
    },

    async updateSession(data) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterSession>
      ).find({
        use_index: sessionByToken,
        selector: {
          sessionToken: { $eq: data.sessionToken },
        },
        limit: 1,
      })
      const previousSessionDoc = res.docs[0]
      if (previousSessionDoc) {
        const currentSessionDoc = {
          ...previousSessionDoc,
          ...data,
        }
        await pouchdb.put(currentSessionDoc)
        return toAdapterSession(currentSessionDoc)
      }
      return null
    },

    async deleteSession(sessionToken) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterSession>
      ).find({
        use_index: sessionByToken,
        selector: {
          sessionToken: { $eq: sessionToken },
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
      await (pouchdb as unknown as PouchDB.Database<VerificationToken>).put({
        _id: [verificationTokenPrefix, ulid()].join("_"),
        ...data,
      })

      return data
    },

    async useVerificationToken({ identifier, token }) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<VerificationToken>
      ).find({
        use_index: verificationTokenByToken,
        selector: {
          identifier: { $eq: identifier },
          token: { $eq: token },
        },
        limit: 1,
      })
      const verificationRequestDoc = res.docs[0]
      if (verificationRequestDoc) {
        await pouchdb.put({
          ...verificationRequestDoc,
          _deleted: true,
        })
        return toVerificationToken(verificationRequestDoc)
      }
      return null
    },
  }
}
