import type { Adapter } from "next-auth/adapters"
import { createHash, randomBytes } from "crypto"
import { Profile } from "next-auth"
import { ulid } from "ulid"

type PouchdbDocument<T> = PouchDB.Core.ExistingDocument<{ data: T }>
type PouchdbFindResponse = PouchDB.Find.FindResponse<any>

interface PouchdbUser {
  id: string
  name?: string
  email?: string
  emailVerified?: Date | string
  image?: string
}

interface PouchdbSession {
  userId: string
  expires: Date | string
  sessionToken: string
  accessToken: string
}

interface PouchdbAccount {
  id: string
  userId: string
  providerType: string
  providerId: string
  providerAccountId: string
  refreshToken: string | null
  accessToken: string | null
  accessTokenExpires: Date | null
}

export const PouchDBAdapter: Adapter<
  PouchDB.Database,
  never,
  PouchdbUser,
  Profile & { emailVerified?: Date },
  PouchdbSession
> = (pouchdb) => {
  return {
    async getAdapter({ session, secret, ...appOptions }) {
      // create PoucDB indexes if they don't exist
      const res = await pouchdb.getIndexes()
      const indexes = res.indexes.map((index) => index.name, [])
      if (!indexes.includes("nextAuthUserByEmail")) {
        await pouchdb.createIndex({
          index: {
            name: "nextAuthUserByEmail",
            ddoc: "nextAuthUserByEmail",
            fields: ["data.email"],
          },
        })
      }
      if (!indexes.includes("nextAuthAccountByProviderId")) {
        await pouchdb.createIndex({
          index: {
            name: "nextAuthAccountByProviderId",
            ddoc: "nextAuthAccountByProviderId",
            fields: ["data.providerId", "data.providerAccountId"],
          },
        })
      }
      if (!indexes.includes("nextAuthSessionByToken")) {
        await pouchdb.createIndex({
          index: {
            name: "nextAuthSessionByToken",
            ddoc: "nextAuthSessionByToken",
            fields: ["data.sessionToken"],
          },
        })
      }
      if (!indexes.includes("nextAuthVerificationRequestByToken")) {
        await pouchdb.createIndex({
          index: {
            name: "nextAuthVerificationRequestByToken",
            ddoc: "nextAuthVerificationRequestByToken",
            fields: ["data.identifier", "data.token"],
          },
        })
      }

      const sessionMaxAge = session.maxAge * 1000 // default is 30 days
      const sessionUpdateAge = session.updateAge * 1000 // default is 1 day

      const hashToken = (token: string) =>
        createHash("sha256").update(`${token}${secret}`).digest("hex")

      return {
        displayName: "POUCHDB",

        async createUser(profile) {
          const data = {
            ...profile,
            id: ["USER", ulid()].join("_"),
          }

          await pouchdb.put({
            _id: data.id,
            data,
          })
          return data
        },

        async getUser(id) {
          const res: PouchdbDocument<PouchdbUser> = await pouchdb.get(id)
          if (typeof res.data?.emailVerified === "string") {
            res.data.emailVerified = new Date(res.data.emailVerified)
          }

          return res?.data ?? null
        },

        async getUserByEmail(email) {
          const res: PouchdbFindResponse = await pouchdb.find({
            use_index: "nextAuthUserByEmail",
            selector: { "data.email": { $eq: email } },
            limit: 1,
          })
          const userDoc: PouchdbDocument<PouchdbUser> = res.docs[0]
          if (userDoc?.data) {
            const user = userDoc.data
            if (typeof user.emailVerified === "string")
              user.emailVerified = new Date(user.emailVerified)
            return user
          }
          return null
        },

        async getUserByProviderAccountId(providerId, providerAccountId) {
          const res: PouchdbFindResponse = await pouchdb.find({
            use_index: "nextAuthAccountByProviderId",
            selector: {
              "data.providerId": { $eq: providerId },
              "data.providerAccountId": { $eq: providerAccountId },
            },
            limit: 1,
          })
          const accountDoc: PouchdbDocument<PouchdbAccount> = res.docs[0]
          if (accountDoc?.data) {
            const userDoc: PouchdbDocument<PouchdbUser> = await pouchdb.get(
              accountDoc.data.userId
            )
            return userDoc?.data ?? null
          }
          return null
        },

        async updateUser(user: PouchdbUser & { id: string }) {
          const update = { ...user }
          const doc: PouchdbDocument<PouchdbUser> = await pouchdb.get(user.id)
          doc.data = {
            ...doc.data,
            ...update,
          }
          await pouchdb.put(doc)
          return doc.data
        },

        async deleteUser(id) {
          const doc: PouchdbDocument<PouchdbUser> = await pouchdb.get(id)
          await pouchdb.put({
            ...doc,
            _deleted: true,
          })
        },

        async linkAccount(
          userId,
          providerId,
          providerType,
          providerAccountId,
          refreshToken,
          accessToken,
          accessTokenExpires
        ) {
          await pouchdb.put({
            _id: ["ACCOUNT", ulid()].join("_"),
            data: {
              userId,
              providerId,
              providerType,
              providerAccountId,
              refreshToken,
              accessToken,
              accessTokenExpires:
                accessTokenExpires != null
                  ? new Date(accessTokenExpires)
                  : null,
            },
          })
        },

        async unlinkAccount(_, providerId, providerAccountId) {
          const account = await pouchdb.find({
            use_index: "nextAuthAccountByProviderId",
            selector: {
              "data.providerId": { $eq: providerId },
              "data.providerAccountId": { $eq: providerAccountId },
            },
            limit: 1,
          })
          await pouchdb.put({
            ...account.docs[0],
            _deleted: true,
          })
        },

        async createSession(user: PouchdbUser & { id: string }) {
          const data = {
            userId: user.id,
            sessionToken: randomBytes(32).toString("hex"),
            accessToken: randomBytes(32).toString("hex"),
            expires: new Date(Date.now() + sessionMaxAge),
          }
          await pouchdb.put({
            _id: ["SESSION", ulid()].join("_"),
            data,
          })
          return data
        },

        async getSession(sessionToken) {
          const res: PouchdbFindResponse = await pouchdb.find({
            use_index: "nextAuthSessionByToken",
            selector: {
              "data.sessionToken": { $eq: sessionToken },
            },
            limit: 1,
          })
          const sessionDoc: PouchdbDocument<PouchdbSession> = res.docs[0]
          if (sessionDoc.data) {
            const session = sessionDoc.data
            if (new Date(session?.expires ?? Infinity) < new Date()) {
              await pouchdb.put({ ...sessionDoc, _deleted: true })
              return null
            }
            return { ...session, expires: new Date(session?.expires ?? "") }
          }
          return null
        },

        async updateSession(session, force) {
          if (
            !force &&
            Number(session.expires) - sessionMaxAge + sessionUpdateAge >
              Date.now()
          ) {
            return null
          }
          const res: PouchdbFindResponse = await pouchdb.find({
            use_index: "nextAuthSessionByToken",
            selector: {
              "data.sessionToken": { $eq: session.sessionToken },
            },
            limit: 1,
          })
          const previousSessionDoc: PouchdbDocument<PouchdbSession> =
            res.docs[0]
          if (previousSessionDoc?.data) {
            const currentSessionDoc: PouchdbDocument<PouchdbSession> = {
              ...previousSessionDoc,
              data: {
                ...previousSessionDoc.data,
                expires: new Date(Date.now() + sessionMaxAge),
              },
            }
            await pouchdb.put(currentSessionDoc)
            return currentSessionDoc.data
          }
          return null
        },

        async deleteSession(sessionToken) {
          const res = await pouchdb.find({
            use_index: "nextAuthSessionByToken",
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

        async createVerificationRequest(identifier, url, token, _, provider) {
          const hashedToken = hashToken(token)
          const data = {
            identifier,
            token: hashedToken,
            expires: new Date(Date.now() + provider.maxAge * 1000),
          }
          await pouchdb.put({
            _id: ["VERIFICATION-REQUEST", ulid()].join("_"),
            data,
          })
          await provider.sendVerificationRequest({
            identifier,
            url,
            token,
            baseUrl: appOptions.baseUrl,
            provider,
          })
        },

        async getVerificationRequest(identifier, token) {
          const hashedToken = hashToken(token)
          const res: PouchdbFindResponse = await pouchdb.find({
            use_index: "nextAuthVerificationRequestByToken",
            selector: {
              "data.identifier": { $eq: identifier },
              "data.token": { $eq: hashedToken },
            },
            limit: 1,
          })
          const verificationRequestDoc = res.docs[0]
          if (verificationRequestDoc?.data) {
            const verificationRequest = verificationRequestDoc.data
            if (
              new Date(verificationRequest?.expires ?? Infinity) < new Date()
            ) {
              await pouchdb.put({
                ...verificationRequestDoc,
                _deleted: true,
              })
              return null
            }
            return {
              ...verificationRequest,
              expires: new Date(verificationRequest?.expires ?? ""),
            }
          }
          return null
        },

        async deleteVerificationRequest(identifier, token) {
          const hashedToken = hashToken(token)
          const res = await pouchdb.find({
            use_index: "nextAuthVerificationRequestByToken",
            selector: {
              "data.identifier": { $eq: identifier },
              "data.token": { $eq: hashedToken },
            },
            limit: 1,
          })
          const verificationRequestDoc = res.docs[0]
          await pouchdb.put({
            ...verificationRequestDoc,
            _deleted: true,
          })
        },
      }
    },
  }
}
