import { beforeAll } from "vitest"

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

const sqliteDB = new Database(":memory:")
let db = new D1Database(new D1DatabaseAPI(sqliteDB as any))
let adapter = D1Adapter(db)

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
