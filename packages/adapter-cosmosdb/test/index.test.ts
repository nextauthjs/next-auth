import { runBasicTests } from "utils/adapter"
import {
  CosmosDbAdapter,
  CosmosDbPartitionConfiguration,
  CosmosDbPartitionStrategy,
  cosmosHelper,
} from ".."
import { CosmosClient } from "@azure/cosmos"
import * as https from "https"

const testMode = process.env.TESTMODE ?? "ID"

const endpoint = "https://localhost:8081/"
const key =
  "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw=="
const client = new CosmosClient({
  endpoint,
  key,
  agent: new https.Agent({ rejectUnauthorized: false }),
})
const { database } = await client.databases.createIfNotExists({
  id: "test-authjs-database",
})
await database.containers.createIfNotExists({
  id: "test-authjs-container",
  partitionKey: {
    paths: ["/partition"],
  },
})
const c = database.container("test-authjs-container")

let pc: CosmosDbPartitionConfiguration | undefined = undefined

switch (testMode) {
  case "ID":
    console.log("Using Same As Id Partition Strategy")
    pc = {
      partitionKey: "partition",
      partitionKeyStrategy: CosmosDbPartitionStrategy.SameAsId,
    } as CosmosDbPartitionConfiguration
    break
  case "DT":
    console.log("Using Same As Data Type Partition Strategy")
    pc = {
      partitionKey: "partition",
      partitionKeyStrategy: CosmosDbPartitionStrategy.SameAsDataType,
    } as CosmosDbPartitionConfiguration
    break
  case "HC":
    console.log("Using Hardcoded Partition Strategy")
    pc = {
      partitionKey: "partition",
      partitionKeyStrategy: CosmosDbPartitionStrategy.HardCodedValue,
      hardCodedValue: "PartitionKey",
    } as CosmosDbPartitionConfiguration
    break
  default:
    console.log("Using no Partition Strategy")
    break
}

const getPartitionKey = (id: string, dataType: string): string | undefined => {
  if (pc) {
    switch (pc.partitionKeyStrategy) {
      case CosmosDbPartitionStrategy.HardCodedValue:
        return pc.hardCodedValue ?? ""
      case CosmosDbPartitionStrategy.SameAsDataType:
        return dataType
      case CosmosDbPartitionStrategy.SameAsId:
        return `|${dataType}|${id}`
    }
  }

  return undefined
}

runBasicTests({
  adapter: CosmosDbAdapter(c, pc),
  testWebAuthnMethods: true,
  db: {
    connect: async () => {
      const allItems = await c.items.readAll().fetchAll()
      if (pc) {
        await Promise.all(
          allItems.resources.map((x) =>
            c.item(x.id ?? "", x[pc.partitionKey]).delete()
          )
        )
      } else {
        await Promise.all(
          allItems.resources.map((x) => c.item(x.id ?? "").delete())
        )
      }
    },
    disconnect: async () => {
      const allItems = await c.items.readAll().fetchAll()
      if (pc) {
        await Promise.all(
          allItems.resources.map((x) =>
            c.item(x.id ?? "", x[pc.partitionKey]).delete()
          )
        )
      } else {
        await Promise.all(
          allItems.resources.map((x) => c.item(x.id ?? "").delete())
        )
      }
    },
    user: async (id: string) => {
      const response = await c
        .item(`|User|${id}`, getPartitionKey(id, "User"))
        .read()
      if (response.statusCode === 404) {
        return null
      }
      return cosmosHelper.withoutKeys(response.resource, pc)
    },
    session: async (sessionToken) => {
      const response = await c
        .item(
          `|Session|${sessionToken}`,
          getPartitionKey(sessionToken, "Session")
        )
        .read()
      if (response.statusCode === 404) {
        return null
      }
      return cosmosHelper.withoutKeysAndId(response.resource, pc)
    },
    account: async (provider_providerAccountId: {
      provider: string
      providerAccountId: string
    }) => {
      const response = await c
        .item(
          `|Account|${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
          getPartitionKey(
            `${provider_providerAccountId.provider}|${provider_providerAccountId.providerAccountId}`,
            "Account"
          )
        )
        .read()
      if (response.statusCode === 404) {
        return null
      }
      return cosmosHelper.withoutKeysAndId(response.resource, pc)
    },
    authenticator: async (credentialId: string) => {
      const response = await c
        .item(
          `|Authenticator|${credentialId}`,
          getPartitionKey(credentialId, "Authenticator")
        )
        .read()
      if (response.statusCode === 404) {
        return null
      }
      return cosmosHelper.withoutKeys(response.resource, pc)
    },
    verificationToken: async (params: {
      identifier: string
      token: string
    }) => {
      const response = await c
        .item(
          `|VerificationToken|${params.token}`,
          getPartitionKey(params.token, "VerificationToken")
        )
        .read()
      if (response.statusCode === 404) {
        return null
      }
      return cosmosHelper.withoutKeysAndId(response.resource, pc)
    },
  },
})
