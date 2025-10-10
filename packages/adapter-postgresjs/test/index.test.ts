import { runBasicTests } from "utils/adapter"
import postgresjs from "postgres"
import PostgresjsAdapter from "../src"
import {
  DBAccount,
  DBUser,
  toAdapterAccount,
  toAdapterUser,
  toAdapterVerificationToken,
} from "../src/types"
import { DBSession } from "../src/types"
import { toAdapterSession } from "../src/types"
import { DBVerificationToken } from "../src/types"

const POOL_SIZE = 20

const sql = postgresjs({
  host: "127.0.0.1",
  port: 5432,
  database: "adapter-postgresjs-test",
  user: "postgresjs",
  password: "postgresjs",
  max: POOL_SIZE,
})

runBasicTests({
  adapter: PostgresjsAdapter(sql),
  db: {
    disconnect: async () => {
      await sql.end()
    },
    user: async (id: string) => {
      const [user] = await sql<
        DBUser[]
      >`SELECT * FROM users WHERE id = ${id} LIMIT 1`
      return user ? toAdapterUser(user) : null
    },
    account: async ({ providerAccountId }) => {
      const [account] = await sql<
        DBAccount[]
      >`SELECT * FROM accounts WHERE provider_account_id = ${providerAccountId} LIMIT 1`

      return account ? toAdapterAccount(account) : null
    },
    session: async (sessionToken) => {
      const [session] = await sql<
        DBSession[]
      >`SELECT * FROM sessions WHERE session_token = ${sessionToken} LIMIT 1`
      return session ? toAdapterSession(session) : null
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
      const [verificationToken] = await sql<
        DBVerificationToken[]
      >`SELECT * FROM verification_tokens WHERE identifier = ${identifier} AND token = ${token} LIMIT 1`

      return verificationToken
        ? toAdapterVerificationToken(verificationToken)
        : null
    },
  },
})
