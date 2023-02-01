import { runBasicTests } from "@next-auth/adapter-test"
import MyAdapter from "../src"
import { getCosmos } from "../src/cosmos"
import https from "node:https"
import { SqlQuerySpec } from "@azure/cosmos"
import { convertCosmosDocument } from "../src/util"

var IP_ADDR: string | undefined = undefined
process.argv.forEach((v) => {
  if (v.includes("-ip=")) IP_ADDR = v.replace("-ip=", "")
})

const ENDPOINT = `https://${"localhost"}:8081`
const KEY =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="

const UnrejectfulAgent = new https.Agent({ rejectUnauthorized: false })

const CLIENT_OPTIONS = {
  endpoint: ENDPOINT,
  key: KEY,
  agent: UnrejectfulAgent,
}

const db = getCosmos({ clientOptions: CLIENT_OPTIONS })

const adapter = MyAdapter({
  clientOptions: CLIENT_OPTIONS,
})

runBasicTests({
  beforeEach: () => {
    process.env.NODE_TLS_UNAUTHORIZED = "0"
  },
  adapter: MyAdapter({
    clientOptions: CLIENT_OPTIONS,
  }),
  db: {
    async disconnect() {
      await (await db.accounts()).delete()
      await (await db.sessions()).delete()
      await (await db.tokens()).delete()
      await (await db.users()).delete()
    },
    async session(sessionToken) {
      const snapshotQuery: SqlQuerySpec = {
        query: `select * from sessions s where s.sessionToken=@sessionTokenValue offset 0 limit 1`,
        parameters: [{ name: "@sessionTokenValue", value: sessionToken }],
      }
      const { resources } = await (await db.sessions()).items
        .query(snapshotQuery)
        .fetchAll()

      if (resources.length > 0) {
        return convertCosmosDocument(resources[0])
      }
      return null
    },
    async user(id) {
      return adapter.getUser(id)
    },
    async account({ provider, providerAccountId }) {
      const snapshotQuery: SqlQuerySpec = {
        query:
          "select * from accounts a where a.provider=@providerValue and a.providerAccountId=@providerAccountIdValue offset 0 limit 1",
        parameters: [
          { name: "@providerValue", value: provider },
          { name: "@providerAccountIdValue", value: providerAccountId },
        ],
      }
      const { resources } = await (await db.accounts()).items
        .query(snapshotQuery)
        .fetchAll()

      if (resources.length > 0) {
        return convertCosmosDocument(resources[0])
      }
      return null
    },
    async verificationToken({ identifier, token }) {
      const snapshotQuery: SqlQuerySpec = {
        query:
          "select * from tokens v where v.identifier=@identifierValue and v.token=@tokenValue offset 0 limit 1",
        parameters: [
          { name: "@identifierValue", value: identifier },
          { name: "@tokenValue", value: token },
        ],
      }
      const { resources } = await (await db.tokens()).items
        .query(snapshotQuery)
        .fetchAll()

      if (resources.length > 0) {
        return convertCosmosDocument(resources[0])
      }
    },
  },
})
