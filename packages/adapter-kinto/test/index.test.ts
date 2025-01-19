import { runBasicTests } from "utils/adapter"
import { KintoClient } from "kinto"
import {
  KintoAdapter,
  toAdapterUser,
  toAdapterAccount,
  toAdapterSession,
  toVerificationToken,
} from "../src" // Adjust to the actual path of your adapter
import {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

const client = new KintoClient("http://localhost:8888/v1") // Replace with your Kinto server URL
const bucket = "auth-test"

const collections = {
  sessions: client.bucket(bucket).collection("sessions"),
  users: client.bucket(bucket).collection("users"),
  accounts: client.bucket(bucket).collection("accounts"),
  verificationTokens: client.bucket(bucket).collection("verification-tokens"),
}

// Clear all records from the collections
async function clearCollections() {
  await Promise.all(
    Object.values(collections).map(async (collection) => {
      const records = await collection.listRecords()
      await Promise.all(
        records.data.map((record) => collection.deleteRecord(record.id))
      )
    })
  )
}

// Test setup
runBasicTests({
  adapter: KintoAdapter({ client, bucket }),
  db: {
    async connect() {
      // Ensure collections exist
      const existingCollections = new Set(
        (await client.bucket(bucket).listCollections()).data.map((c) => c.id)
      )
      await Promise.all(
        Object.keys(collections).map(async (key) => {
          if (!existingCollections.has(key)) {
            return client.bucket(bucket).createCollection(key)
          } else {
            return Promise.resolve()
          }
        })
      )
    },
    async disconnect() {
      await clearCollections()
    },
    async user(id) {
      try {
        const record = await collections.users.getRecord(id)
        return toAdapterUser(record.data)
      } catch {
        return null
      }
    },
    async account({ provider, providerAccountId }) {
      const result = await collections.accounts.listRecords({
        filters: { provider, providerAccountId },
      })
      return toAdapterAccount(result.data.length ? result.data[0] : null)
    },
    async session(sessionToken) {
      const result = await collections.sessions.listRecords({
        filters: { sessionToken },
      })
      return toAdapterSession(result.data.length ? result.data[0] : null)
    },
    async verificationToken({ identifier, token }) {
      const result = await collections.verificationTokens.listRecords({
        filters: { identifier, token },
      })
      return toVerificationToken(result.data.length ? result.data[0] : null)
    },
  },
})
