import { runBasicTests } from "@auth/adapter-test"
import { createClient } from "@libsql/client"
import { down, LibSQLAdapter, up } from "../src"
import { LibSQLWrapper } from "../src/utils"
import { AdapterAccount } from "@auth/core/adapters"

const client = createClient({
  url: "file:test.db",
})

const clientWrapper = new LibSQLWrapper(client)

runBasicTests({
  adapter: LibSQLAdapter(client),
  db: {
    connect: async () => {
      await up(client)
    },
    disconnect: async () => {
      await down(client)
      client.close()
    },
    user: async (id: string) => {
      return await clientWrapper.first`SELECT * FROM user WHERE id = ${id}`
    },
    account: async ({ provider, providerAccountId }) => {
      const temp = await clientWrapper.first<
        AdapterAccount & { session_state: string }
      >`SELECT * FROM account WHERE provider = ${provider} AND providerAccountId = ${providerAccountId}`

      if (temp === null) {
        return null
      }

      const session_state =
        temp.session_state === undefined
          ? undefined
          : JSON.parse(temp.session_state)

      return {
        ...temp,
        session_state,
      }
    },
    session: async (sessionToken) => {
      return await clientWrapper.first`SELECT * FROM session WHERE sessionToken = ${sessionToken}`
    },
    async verificationToken({ identifier, token }) {
      return await clientWrapper.first`SELECT * FROM verification_token WHERE identifier = ${identifier} AND token = ${token}`
    },
  },
})
