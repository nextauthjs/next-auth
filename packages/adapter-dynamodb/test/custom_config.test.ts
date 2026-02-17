import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import {
  DynamoDBAdapter,
  DynamoDBAdapterOptions,
  DynamoDBEntityTypeOptions,
  format,
} from "../src/index.ts"
import { runBasicTests } from "utils/adapter"

const config = {
  endpoint: "http://127.0.0.1:8000",
  region: "eu-central-1",
  tls: false,
  credentials: {
    accessKeyId: "foo",
    secretAccessKey: "bar",
  },
}

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

const TableName = "next-auth-custom-config"

const cf: Required<DynamoDBAdapterOptions> = {
  tableName: TableName,
  partitionKey: "primekey",
  sortKey: "secondkey",
  indexName: "SomeIndex",
  indexPartitionKey: "GlobalSI1",
  indexSortKey: "GlobalSI2",
  entityTagName: "_et",
  entityTags: {
    user: "USR",
    account: "ACT",
    session: "SES",
    vt: "VVT",
  },
  entitySlugs: {
    user: "USR#",
    account: "ACT#",
    session: "SES#",
  },
}

const from = format.from({
  dynamoKeys: [
    cf.partitionKey,
    cf.sortKey,
    cf.indexPartitionKey,
    cf.indexSortKey,
  ],
  EntityTagName: cf.entityTagName,
  EntityTags: cf.entityTags as Required<DynamoDBEntityTypeOptions>,
})

const adapter = DynamoDBAdapter(client, { ...cf })

runBasicTests({
  adapter,
  db: {
    async user(id) {
      const user = await client.get({
        TableName,
        Key: {
          [cf.partitionKey]: `${cf.entitySlugs.user}${id}`,
          [cf.sortKey]: `${cf.entitySlugs.user}${id}`,
        },
      })

      return from(user.Item)
    },
    async session(token) {
      const session = await client.query({
        TableName,
        IndexName: cf.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": cf.indexPartitionKey,
          "#gsi1sk": cf.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${cf.entitySlugs.session}${token}`,
          ":gsi1sk": `${cf.entitySlugs.session}${token}`,
        },
      })

      return from(session.Items?.[0])
    },
    async account({ provider, providerAccountId }) {
      const account = await client.query({
        TableName,
        IndexName: cf.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": cf.indexPartitionKey,
          "#gsi1sk": cf.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${cf.entitySlugs.account}${provider}`,
          ":gsi1sk": `${cf.entitySlugs.account}${providerAccountId}`,
        },
      })

      return from(account.Items?.[0])
    },
    async verificationToken({ token, identifier }) {
      const vt = await client.get({
        TableName,
        Key: {
          [cf.partitionKey]: `VT#${identifier}`,
          [cf.sortKey]: `VT#${token}`,
        },
      })
      return from(vt.Item)
    },
  },
})
