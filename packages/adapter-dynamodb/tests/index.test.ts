import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter } from "../src"
import { runBasicTests } from "adapter-test"
import { format } from "../src/"
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

const adapter = DynamoDBAdapter(client)

const TableName = "next-auth"

runBasicTests({
  adapter,
  db: {
    async user(id) {
      const user = await client.get({
        TableName,
        Key: {
          pk: `USER#${id}`,
          sk: `USER#${id}`,
        },
      })

      return format.from(user.Item)
    },
    async session(token) {
      const session = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${token}`,
          ":gsi1sk": `SESSION#${token}`,
        },
      })

      return format.from(session.Items?.[0])
    },
    async account({ provider, providerAccountId }) {
      const account = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      })

      return format.from(account.Items?.[0])
    },
    async verificationToken({ token, identifier }) {
      const vt = await client.get({
        TableName,
        Key: {
          pk: `VT#${identifier}`,
          sk: `VT#${token}`,
        },
      })
      return format.from(vt.Item)
    },
  },
})
