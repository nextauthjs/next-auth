import { randomUUID, runBasicTests } from "@next-auth/adapter-test"
import { PouchDBAdapter } from "../src"
import PouchDB from "pouchdb"
import find from "pouchdb-find"
import memoryAdapter from "pouchdb-adapter-memory"
import { ulid } from "ulid"
import { AdapterUser } from "next-auth/adapters"

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
// Basic tests
pouchdb = new PouchDB(ulid(), { adapter: "memory" })
console.log({ pouchdb })
runBasicTests({
  adapter: PouchDBAdapter(pouchdb),
  db: {
    id() {
      return randomUUID()
    },
    disconnect,
    user: async (id) => {
      const { _id, _rev, ...res } = await pouchdb.get<AdapterUser>(id)

      if (typeof res?.emailVerified === "string") {
        res.emailVerified = new Date(res.emailVerified)
      }
      res.id = _id
      return res
    },
    account: async ({ provider, providerAccountId }) => {
      const res = await pouchdb.find({
        use_index: "nextAuthAccountByProviderId",
        selector: {
          "data.providerId": { $eq: provider },
          "data.providerAccountId": { $eq: providerAccountId },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      return doc?.data ?? null
    },
    session: async (sessionToken) => {
      const res = await pouchdb.find({
        use_index: "nextAuthSessionByToken",
        selector: {
          "data.sessionToken": { $eq: sessionToken },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      return doc?.data ?? null
    },
    async verificationToken({ identifier, token }) {
      const res = await pouchdb.find({
        use_index: "nextAuthVerificationRequestByToken",
        selector: {
          "data.identifier": { $eq: identifier },
          "data.token": { $eq: token },
        },
        limit: 1,
      })
      const doc: any = res.docs[0]
      const verificationRequest = doc?.data ?? null
      if (verificationRequest?.expires) {
        return {
          ...verificationRequest,
          expires: new Date(verificationRequest.expires),
        }
      }
      return null
    },
  },
})
