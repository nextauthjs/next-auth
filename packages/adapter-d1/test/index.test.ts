import {
  D1Adapter,
  up,
  getRecord,
  GET_USER_BY_ID_SQL,
  GET_SESSION_BY_TOKEN_SQL,
  GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL,
  GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL,
} from "../src"
import {
  AdapterSession,
  AdapterUser,
  AdapterAccount,
} from "@auth/core/adapters"
import { D1Database, D1DatabaseAPI } from "@miniflare/d1"
import { runBasicTests } from "utils/adapter"
import Database from "better-sqlite3"

globalThis.crypto ??= require("node:crypto").webcrypto

if (process.env.CI) {
  // TODO: Fix this
  test('Skipping D1Adapter tests in CI because of "Error: Must use import to load ES Module: next-auth/node_modules/.pnpm/undici@5.20.0/node_modules/undici/lib/llhttp/llhttp.wasm" errors. Should revisit', () => {
    expect(true).toBe(true)
  })
  process.exit(0)
}

const sqliteDB = new Database(":memory:")
let db = new D1Database(new D1DatabaseAPI(sqliteDB as any))
let adapter = D1Adapter(db)

// put stuff here if we need some async init
beforeAll(async () => await up(db))
runBasicTests({
  adapter,
  db: {
    user: async (id) =>
      await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [id]),
    session: async (sessionToken) =>
      await getRecord<AdapterSession>(db, GET_SESSION_BY_TOKEN_SQL, [
        sessionToken,
      ]),
    account: async ({ provider, providerAccountId }) =>
      await getRecord<AdapterAccount>(
        db,
        GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL,
        [provider, providerAccountId]
      ),
    verificationToken: async ({ identifier, token }) =>
      await getRecord(db, GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL, [
        identifier,
        token,
      ]),
  },
})
