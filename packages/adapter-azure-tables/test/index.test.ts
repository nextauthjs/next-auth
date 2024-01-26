import { runBasicTests } from "utils/adapter"
import {
  AzureNamedKeyCredential,
  TableServiceClient,
  TableClient,
} from "@azure/data-tables"
import { keys, TableStorageAdapter, withoutKeys } from "../src"
import type { AdapterUser, VerificationToken } from "@auth/core/adapters"

const testAccount = {
  // default constants used by a dev instance of azurite
  name: "devstoreaccount1",
  key: "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==",
  tableEndpoint: "http://127.0.0.1:10002/devstoreaccount1",
}

const authTableName = "authTest"

const credential = new AzureNamedKeyCredential(
  testAccount.name,
  testAccount.key
)

const authClient = new TableClient(
  testAccount.tableEndpoint,
  authTableName,
  credential,
  { allowInsecureConnection: true }
)

runBasicTests({
  adapter: TableStorageAdapter(authClient),
  db: {
    async connect() {
      const serviceClient = new TableServiceClient(
        testAccount.tableEndpoint,
        credential,
        { allowInsecureConnection: true }
      )
      await serviceClient.createTable(authTableName)
    },
    async user(id) {
      try {
        const userById = await authClient.getEntity<AdapterUser>(keys.user, id)

        return withoutKeys(userById)
      } catch (e) {
        console.error(e)
        return null
      }
    },
    async account(provider_providerAccountId) {
      try {
        const account = await authClient.getEntity(
          keys.account,
          `${provider_providerAccountId.providerAccountId}_${provider_providerAccountId.provider}`
        )

        return withoutKeys(account)
      } catch {
        return null
      }
    },
    async session(sessionToken) {
      try {
        const session = await authClient.getEntity(keys.session, sessionToken)

        return withoutKeys(session)
      } catch {
        return null
      }
    },
    async verificationToken(identifier_token) {
      try {
        const verificationToken = await authClient.getEntity<VerificationToken>(
          keys.verificationToken,
          identifier_token.token
        )

        if (verificationToken.identifier !== identifier_token.identifier) {
          return null
        }

        return withoutKeys(verificationToken)
      } catch {
        return null
      }
    },
  },
})
