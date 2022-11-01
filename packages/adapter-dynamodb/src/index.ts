import { randomBytes } from "crypto"

import type {
  BatchWriteCommandInput,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb"
import type {
  Adapter,
  AdapterSession,
  AdapterAccount,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

import { formatFactory, generateUpdateExpression, DynamoDBAdapterOptions } from "./utils"

export { generateUpdateExpression }

export function DynamoDBAdapter(
  client: DynamoDBDocument,
  options?: Partial<DynamoDBAdapterOptions>
): Adapter {
  const opt: DynamoDBAdapterOptions = {
    tableName: options?.tableName ?? "next-auth",
    partitionKey: options?.partitionKey ?? "pk",
    sortKey: options?.sortKey ?? "sk",
    indexName: options?.indexName ?? "GSI1",
    indexPartitionKey: options?.indexPartitionKey ?? "GSI1PK",
    indexSortKey: options?.indexSortKey ?? "GSI1SK",
    ttlAttribute: options?.ttlAttribute ?? "expires",
  };
  const format = formatFactory(opt);

  return {
    async createUser(data) {
      const user: AdapterUser = {
        ...(data as any),
        id: randomBytes(16).toString("hex"),
      }

      await client.put({
        TableName: opt.tableName,
        Item: format.to({
          ...user,
          [opt.partitionKey]: `USER#${user.id}`,
          [opt.sortKey]: `USER#${user.id}`,
          type: "USER",
          [opt.indexPartitionKey]: `USER#${user.email}`,
          [opt.indexSortKey]: `USER#${user.email}`,
        }),
      })

      return user
    },
    async getUser(userId) {
      const data = await client.get({
        TableName: opt.tableName,
        Key: {
          [opt.partitionKey]: `USER#${userId}`,
          [opt.sortKey]: `USER#${userId}`,
        },
      })
      return format.from<AdapterUser>(data.Item)
    },
    async getUserByEmail(email) {
      const data = await client.query({
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
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
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      })
      if (!data.Items?.length) return null

      const accounts = data.Items[0] as AdapterAccount
      const res = await client.get({
        TableName: opt.tableName,
        Key: {
          [opt.partitionKey]: `USER#${accounts.userId}`,
          [opt.sortKey]: `USER#${accounts.userId}`,
        },
      })
      return format.from<AdapterUser>(res.Item)
    },
    async updateUser(user) {
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(user, format)
      const data = await client.update({
        TableName: opt.tableName,
        Key: {
          // next-auth type is incorrect it should be Partial<AdapterUser> & {id: string} instead of just Partial<AdapterUser>
          [opt.partitionKey]: `USER#${user.id as string}`,
          [opt.sortKey]: `USER#${user.id as string}`,
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
        TableName: opt.tableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": opt.partitionKey },
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
              [opt.sortKey]: item[opt.sortKey],
              [opt.partitionKey]: item[opt.partitionKey],
            },
          },
        }
      })
      // batch write commands cannot handle more than 25 requests at once
      const itemsToDeleteMax = itemsToDelete.slice(0, 25)
      const param: BatchWriteCommandInput = {
        RequestItems: { [opt.tableName]: itemsToDeleteMax },
      }
      await client.batchWrite(param)
      return format.from<AdapterUser>(user)
    },
    async linkAccount(data) {
      const item = {
        ...data,
        id: randomBytes(16).toString("hex"),
        [opt.partitionKey]: `USER#${data.userId}`,
        [opt.sortKey]: `ACCOUNT#${data.provider}#${data.providerAccountId}`,
        [opt.indexPartitionKey]: `ACCOUNT#${data.provider}`,
        [opt.indexSortKey]: `ACCOUNT#${data.providerAccountId}`,
      }
      await client.put({ TableName: opt.tableName, Item: format.to(item) })
      return data
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const data = await client.query({
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      })
      const account = format.from<AdapterAccount>(data.Items?.[0])
      if (!account) return
      await client.delete({
        TableName: opt.tableName,
        Key: {
          [opt.partitionKey]: `USER#${account.userId}`,
          [opt.sortKey]: `ACCOUNT#${provider}#${providerAccountId}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return account
    },
    async getSessionAndUser(sessionToken) {
      const data = await client.query({
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      const session = format.from<AdapterSession>(data.Items?.[0])
      if (!session) return null
      const res = await client.get({
        TableName: opt.tableName,
        Key: {
          [opt.partitionKey]: `USER#${session.userId}`,
          [opt.sortKey]: `USER#${session.userId}`,
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
        TableName: opt.tableName,
        Item: format.to({
          [opt.partitionKey]: `USER#${data.userId}`,
          [opt.sortKey]: `SESSION#${data.sessionToken}`,
          [opt.indexSortKey]: `SESSION#${data.sessionToken}`,
          [opt.indexPartitionKey]: `SESSION#${data.sessionToken}`,
          type: "SESSION",
          ...data,
        }),
      })
      return session
    },
    async updateSession(session) {
      const { sessionToken } = session
      const data = await client.query({
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      if (!data.Items?.length) return null
      const item = data.Items[0] as any
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(session, format)
      const res = await client.update({
        TableName: opt.tableName,
        Key: { [opt.partitionKey]: item[opt.partitionKey], [opt.sortKey]: item[opt.sortKey] },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      return format.from<AdapterSession>(res.Attributes)
    },
    async deleteSession(sessionToken) {
      const data = await client.query({
        TableName: opt.tableName,
        IndexName: opt.indexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": opt.indexPartitionKey,
          "#gsi1sk": opt.indexSortKey,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      if (!data?.Items?.length) return null

      const item = data.Items[0]

      const res = await client.delete({
        TableName: opt.tableName,
        Key: { [opt.partitionKey]: item[opt.partitionKey], [opt.sortKey]: item[opt.sortKey] },
        ReturnValues: "ALL_OLD",
      })
      return format.from<AdapterSession>(res.Attributes)
    },
    async createVerificationToken(data) {
      await client.put({
        TableName: opt.tableName,
        Item: format.to({
          [opt.partitionKey]: `VT#${data.identifier}`,
          [opt.sortKey]: `VT#${data.token}`,
          type: "VT",
          ...data,
        }),
      })
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const data = await client.delete({
        TableName: opt.tableName,
        Key: {
          [opt.partitionKey]: `VT#${identifier}`,
          [opt.sortKey]: `VT#${token}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return format.from<VerificationToken>(data.Attributes)
    },
  }
}
