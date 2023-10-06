import {
  CloudflareKVAdapter, hydrateDates
} from "../src"
import {
  AdapterSession,
  AdapterUser,
  AdapterAccount,
} from "@auth/core/adapters"
import { KVNamespace } from "@miniflare/kv"
import { runBasicTests } from "@auth/adapter-test"
import { MemoryStorage } from "@miniflare/storage-memory";

globalThis.crypto ??= require("node:crypto").webcrypto

if (process.env.CI) {
  // TODO: Fix this
  test('Skipping CloudflareKVAdapter tests in CI because of "Error: Must use import to load ES Module: next-auth/node_modules/.pnpm/undici@5.20.0/node_modules/undici/lib/llhttp/llhttp.wasm" errors. Should revisit', () => {
    expect(true).toBe(true)
  })
  process.exit(0)
}

const client = new KVNamespace(new MemoryStorage());
let adapter = CloudflareKVAdapter(client)

runBasicTests({
  adapter: CloudflareKVAdapter(client, { baseKeyPrefix: "testApp:" }),
  db: {
    async user(id: string) {
      const data = await client.get<object>(`testApp:user:${id}`, { type: "json" })
      if (!data) return null
      return hydrateDates(data)
    },
    async account({ provider, providerAccountId }) {
      const data = await client.get<object>(
        `testApp:user:account:${provider}:${providerAccountId}`, { type: "json" }
      )
      if (!data) return null
      return hydrateDates(data)
    },
    async session(sessionToken) {
      const data = await client.get<object>(
        `testApp:user:session:${sessionToken}`, { type: "json" }
      )
      if (!data) return null
      return hydrateDates(data)
    },
    async verificationToken(where) {
      const data = await client.get<object>(
        `testApp:user:token:${where.identifier}:${where.token}`, { type: "json" }
      )
      if (!data) return null
      return hydrateDates(data)
    },
  },
})
