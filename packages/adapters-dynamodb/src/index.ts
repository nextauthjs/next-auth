import { randomBytes } from "crypto"

import type {
  BatchWriteCommandInput,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb"
import type { Account } from "next-auth"
import type {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

import { format, generateUpdateExpression } from "./utils"

export { format, generateUpdateExpression }

export function DynamoDBAdapter(
  client: DynamoDBDocument,
  options?: { tableName: string }
): Adapter {
  const TableName = options?.tableName ?? "next-auth"

  return {
    async createUser(data) {
      const user: AdapterUser = {
        ...(data as any),
        id: randomBytes(16).toString("hex"),
      }

      await client.put({
        TableName,
        Item: format.to({
          ...user,
          pk: `USER#${user.id}`,
          sk: `USER#${user.id}`,
          type: "USER",
          GSI1PK: `USER#${user.email as string}`,
          GSI1SK: `USER#${user.email as string}`,
        }),
      })

      return user
    },
    async getUser(userId) {
      const data = await client.get({
        TableName,
        Key: {
          pk: `USER#${userId}`,
          sk: `USER#${userId}`,
        },
      })
      return format.from<AdapterUser>(data.Item)
    },
    async getUserByEmail(email) {
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `USER#${email}`,
          ":gsi1sk": `USER#${email}`,
        },
      })

      return format.from<AdapterUser>(data.Items?.[0])
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const data = await client.query({
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
      if (!data.Items?.length) return null

      const accounts = data.Items[0] as Account
      const res = await client.get({
        TableName,
        Key: {
          pk: `USER#${accounts.userId}`,
          sk: `USER#${accounts.userId}`,
        },
      })
      return format.from<AdapterUser>(res.Item)
    },
    async updateUser(user) {
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(user)
      const data = await client.update({
        TableName,
        Key: {
          // next-auth type is incorrect it should be Partial<AdapterUser> & {id: string} instead of just Partial<AdapterUser>
          pk: `USER#${user.id as string}`,
          sk: `USER#${user.id as string}`,
        },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return format.from<AdapterUser>(data.Attributes)!
    },
    async deleteUser(userId) {
      // query all the items related to the user to delete
      const res = await client.query({
        TableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": "pk" },
        ExpressionAttributeValues: { ":pk": `USER#${userId}` },
      })
      if (!res.Items) return null
      const items = res.Items
      // find the user we want to delete to return at the end of the function call
      const user = items.find((item) => item.type === "USER")
      const itemsToDelete = items.map((item) => {
        return {
          DeleteRequest: {
            Key: {
              sk: item.sk,
              pk: item.pk,
            },
          },
        }
      })
      // batch write commands cannot handle more than 25 requests at once
      const itemsToDeleteMax = itemsToDelete.slice(0, 25)
      const param: BatchWriteCommandInput = {
        RequestItems: { [TableName]: itemsToDeleteMax },
      }
      await client.batchWrite(param)
      return format.from<AdapterUser>(user)
    },
    async linkAccount(data) {
      const item = {
        ...data,
        id: randomBytes(16).toString("hex"),
        pk: `USER#${data.userId}`,
        sk: `ACCOUNT#${data.provider}#${data.providerAccountId}`,
        GSI1PK: `ACCOUNT#${data.provider}`,
        GSI1SK: `ACCOUNT#${data.providerAccountId}`,
      }
      await client.put({ TableName, Item: format.to(item) })
      return data
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const data = await client.query({
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
      const account = format.from<Account>(data.Items?.[0])
      if (!account) return
      await client.delete({
        TableName,
        Key: {
          pk: `USER#${account.userId}`,
          sk: `ACCOUNT#${provider}#${providerAccountId}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return account
    },
    async getSessionAndUser(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      const session = format.from<AdapterSession>(data.Items?.[0])
      if (!session) return null
      const res = await client.get({
        TableName,
        Key: {
          pk: `USER#${session.userId}`,
          sk: `USER#${session.userId}`,
        },
      })
      const user = format.from<AdapterUser>(res.Item)
      if (!user) return null
      return { user, session }
    },
    async createSession(data) {
      const session = {
        id: randomBytes(16).toString("hex"),
        ...data,
      }
      await client.put({
        TableName,
        Item: format.to({
          pk: `USER#${data.userId}`,
          sk: `SESSION#${data.sessionToken}`,
          GSI1SK: `SESSION#${data.sessionToken}`,
          GSI1PK: `SESSION#${data.sessionToken}`,
          type: "SESSION",
          ...data,
        }),
      })
      return session
    },
    async updateSession(session) {
      const { sessionToken } = session
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      if (!data.Items?.length) return null
      const { pk, sk } = data.Items[0] as any
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(session)
      const res = await client.update({
        TableName,
        Key: { pk, sk },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      return format.from<AdapterSession>(res.Attributes)
    },
    async deleteSession(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK",
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      if (!data?.Items?.length) return null

      const { pk, sk } = data.Items[0]

      const res = await client.delete({
        TableName,
        Key: { pk, sk },
        ReturnValues: "ALL_OLD",
      })
      return format.from<AdapterSession>(res.Attributes)
    },
    async createVerificationToken(data) {
      await client.put({
        TableName,
        Item: format.to({
          pk: `VT#${data.identifier}`,
          sk: `VT#${data.token}`,
          type: "VT",
          ...data,
        }),
      })
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const data = await client.delete({
        TableName,
        Key: {
          pk: `VT#${identifier}`,
          sk: `VT#${token}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return format.from<VerificationToken>(data.Attributes)
    },
  }
}
