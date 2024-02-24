import { runBasicTests } from "utils/adapter"
import {
  createIndexes,
  PouchDBAdapter,
  toAdapterAccount,
  toAdapterSession,
  toAdapterUser,
  toVerificationToken,
} from "../src"
import PouchDB from "pouchdb"
import find from "pouchdb-find"
import memoryAdapter from "pouchdb-adapter-memory"
import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

// pouchdb setup
PouchDB.plugin(memoryAdapter).plugin(find)
let pouchdb: PouchDB.Database
let pouchdbIsDestroyed: boolean = false
PouchDB.on("created", function () {
  pouchdbIsDestroyed = false
})
PouchDB.on("destroyed", function () {
  pouchdbIsDestroyed = true
})
const disconnect = async () => {
  if (!pouchdbIsDestroyed) await pouchdb.destroy()
}
pouchdb = new PouchDB(crypto.randomUUID(), { adapter: "memory" })

// Basic tests
runBasicTests({
  adapter: PouchDBAdapter({ pouchdb }),
  skipTests: ["deleteUser"],
  db: {
    async connect() {
      await createIndexes(pouchdb)
    },
    disconnect,
    user: async (id) => {
      try {
        const res = await pouchdb.get<AdapterUser>(id)

        return toAdapterUser(res)
      } catch {
        return null
      }
    },
    account: async ({ provider, providerAccountId }) => {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterAccount>
      ).find({
        use_index: "nextAuthAccountByProviderId",
        selector: {
          provider: { $eq: provider },
          providerAccountId: { $eq: providerAccountId },
        },
        limit: 1,
      })
      const doc = res.docs[0]
      return doc ? toAdapterAccount(doc) : null
    },
    session: async (sessionToken) => {
      const res = await (
        pouchdb as unknown as PouchDB.Database<AdapterSession>
      ).find({
        use_index: "nextAuthSessionByToken",
        selector: {
          sessionToken: { $eq: sessionToken },
        },
        limit: 1,
      })
      const doc = res.docs[0]
      return doc ? toAdapterSession(doc) : null
    },
    async verificationToken({ identifier, token }) {
      const res = await (
        pouchdb as unknown as PouchDB.Database<VerificationToken>
      ).find({
        use_index: "nextAuthVerificationRequestByToken",
        selector: {
          identifier: { $eq: identifier },
          token: { $eq: token },
        },
        limit: 1,
      })
      const verificationRequest = res.docs[0]
      return toVerificationToken(verificationRequest)
    },
  },
})
