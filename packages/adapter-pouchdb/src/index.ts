/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://pouchdb.com/api.html">PouchDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://pouchdb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/pouchdb.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth pouchdb pouchdb-find @next-auth/pouchdb-adapter
 * ```
 *
 * @module @next-auth/pouchdb-adapter
 */

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
  | "accountByProviderId"
  | "sessionByToken"
  | "verificationTokenByToken",
  string
>

/**
 * Configure the adapter
 */
export interface PouchDBAdapterOptions {
  /**
   * Your PouchDB instance, with the `pouchdb-find` plugin installed.
   * @example
   * ```javascript
   * import PouchDB from "pouchdb"
   *
   * PouchDB
   *   .plugin(require("pouchdb-adapter-leveldb")) // Or any other adapter
   *   .plugin(require("pouchdb-find")) // Don't forget the `pouchdb-find` plugin
   *
   * const pouchdb = new PouchDB("auth_db", { adapter: "leveldb" })
   */
  pouchdb: PouchDB.Database
  /**
   * Override the default prefix names.
   *
   * @default
   * ```js
   * {
   *   user: "USER",
   *   account: "ACCOUNT",
   *   session: "SESSION",
   *   verificationToken: "VERIFICATION-TOKEN"
   * }
   * ```
   */
  prefixes?: PrefixConfig
  /**
   * Override the default index names.
   *
   * @default
   * ```js
   * {
   *   userByEmail: "nextAuthUserByEmail",
   *   accountByProviderId: "nextAuthAccountByProviderId",
   *   sessionByToken: "nextAuthSessionByToken",
   *   verificationTokenByToken: "nextAuthVerificationRequestByToken"
   * }
   * ```
   */
  indexes?: IndexConfig
}

/**
 * :::info
 * Depending on your architecture you can use PouchDB's http adapter to reach any database compliant with the CouchDB protocol (CouchDB, Cloudant, ...) or use any other PouchDB compatible adapter (leveldb, in-memory, ...)
 * :::
 *
 * #### Basic usage
 *
 * :::note
 * Your PouchDB instance MUST provide the `pouchdb-find` plugin since it is used internally by the adapter to build and manage indexes
 * :::
 *
 * Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object:
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { PouchDBAdapter } from "@next-auth/pouchdb-adapter"
 * import PouchDB from "pouchdb"
 *
 * // Setup your PouchDB instance and database
 * PouchDB
 *   .plugin(require("pouchdb-adapter-leveldb")) // Or any other adapter
 *   .plugin(require("pouchdb-find")) // Don't forget the `pouchdb-find` plugin
 *
 * const pouchdb = new PouchDB("auth_db", { adapter: "leveldb" })
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-options
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_ID,
 *       clientSecret: process.env.GOOGLE_SECRET,
 *     }),
 *   ],
 *   adapter: PouchDBAdapter(pouchdb),
 *   // ...
 * })
 * ```
 *
 * #### Advanced usage
 *
 * ##### Memory-First Caching Strategy
 *
 * If you need to boost your authentication layer performance, you may use PouchDB's powerful sync features and various adapters, to build a memory-first caching strategy.
 *
 * Use an in-memory PouchDB as your main authentication database, and synchronize it with any other persisted PouchDB. You may do a one way, one-off replication at startup from the persisted PouchDB into the in-memory PouchDB, then two-way, continuous sync.
 *
 * This will most likely not increase performance much in a serverless environment due to various reasons such as concurrency, function startup time increases, etc.
 *
 * For more details, please see https://pouchdb.com/api.html#sync
 *
 */
export function PouchDBAdapter(options: PouchDBAdapterOptions): Adapter {
  const { pouchdb } = options
  const {
    userByEmail = "nextAuthUserByEmail",
    accountByProviderId = "nextAuthAccountByProviderId",
    sessionByToken = "nextAuthSessionByToken",
    verificationTokenByToken = "nextAuthVerificationRequestByToken",
  } = options?.indexes ?? {}
  const {
    user: userPrefix = "USER",
    account: accountPrefix = "ACCOUNT",
    session: sessionPrefix = "SESSION",
    verificationToken: verificationTokenPrefix = "VERIFICATION-TOKEN",
  } = options?.prefixes ?? {}

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

export async function createIndexes(
  pouchdb: PouchDB.Database,
  indexes?: IndexConfig
) {
  const {
    userByEmail = "nextAuthUserByEmail",
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
function toAdapter<T>(
  dbObject: T & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) {
  const {
    _id,
    _rev,
    _conflicts,
    _attachments,
    _revisions,
    _revs_info,
    ...rest
  } = dbObject
  return { ...rest }
}

/** @internal */
export function toAdapterUser(
  user: AdapterUser & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) {
  if (typeof user?.emailVerified === "string")
    user.emailVerified = new Date(user.emailVerified)
  return { ...toAdapter(user), id: user._id }
}

/** @internal */
export function toAdapterSession(
  session: AdapterSession & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) {
  if (typeof session?.expires === "string")
    session.expires = new Date(session.expires)
  return { ...toAdapter(session), id: session._id }
}

/** @internal */
export function toAdapterAccount(
  account: AdapterAccount & PouchDB.Core.IdMeta & PouchDB.Core.GetMeta
) {
  return { ...toAdapter(account), id: account._id }
}

/** @internal */
export function toVerificationToken(
  verificationToken: VerificationToken &
    PouchDB.Core.IdMeta &
    PouchDB.Core.GetMeta
) {
  if (typeof verificationToken?.expires === "string")
    verificationToken.expires = new Date(verificationToken.expires)
  return { ...toAdapter(verificationToken) }
}
