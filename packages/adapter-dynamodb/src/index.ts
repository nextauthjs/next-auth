/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>Official <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html">DynamoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://docs.aws.amazon.com/dynamodb/index.html">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/dynamodb.png" width="48"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/dynamodb-adapter
 * ```
 *
 * @module @auth/dynamodb-adapter
 */

import type {
  BatchWriteCommandInput,
  DynamoDBDocument,
} from "@aws-sdk/lib-dynamodb"
import {
  type Adapter,
  type AdapterSession,
  type AdapterAccount,
  type AdapterUser,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters"

export interface DynamoDBEntityTypeOptions {
  user?: string
  account?: string
  session?: string
  vt?: string
}

export interface DynamoDBAdapterOptions {
  tableName?: string
  partitionKey?: string
  sortKey?: string
  indexName?: string
  indexPartitionKey?: string
  indexSortKey?: string
  entityTagName?: string
  entityTags?: DynamoDBEntityTypeOptions
  entitySlugs?: DynamoDBEntityTypeOptions
}

type DynamoDBAdapterFormatOptions = {
  dynamoKeys: Array<string>
  EntityTagName: string
  EntityTags: Required<DynamoDBEntityTypeOptions>
}

export function DynamoDBAdapter(
  client: DynamoDBDocument,
  options?: DynamoDBAdapterOptions
): Adapter {
  const TableName = options?.tableName ?? "next-auth"
  const pk = options?.partitionKey ?? "pk"
  const sk = options?.sortKey ?? "sk"
  const IndexName = options?.indexName ?? "GSI1"
  const GSI1PK = options?.indexPartitionKey ?? "GSI1PK"
  const GSI1SK = options?.indexSortKey ?? "GSI1SK"
  const EntityTagName = options?.entityTagName ?? "type"
  const defaultEntityTags = {
    user: "USER",
    account: "ACCOUNT",
    session: "SESSION",
    vt: "VT",
  }
  const EntityTags = { ...defaultEntityTags, ...options?.entityTags }

  const defaultEntitySlugs = {
    user: "USER#",
    account: "ACCOUNT#",
    session: "SESSION#",
    vt: "VT#",
  }
  const EntitySlugs = { ...defaultEntitySlugs, ...options?.entitySlugs }

  const formatOptions = {
    dynamoKeys: [pk, sk, GSI1PK, GSI1SK],
    EntityTagName,
    EntityTags,
  }

  const from = format.from(formatOptions)

  return {
    async createUser(data) {
      const user: AdapterUser = {
        ...(data as any),
        id: crypto.randomUUID(),
      }

      await client.put({
        TableName,
        Item: format.to({
          ...user,
          [pk]: `${EntitySlugs.user}${user.id}`,
          [sk]: `${EntitySlugs.user}${user.id}`,
          [EntityTagName]: EntityTags.user,
          [GSI1PK]: `${EntitySlugs.user}${user.email}`,
          [GSI1SK]: `${EntitySlugs.user}${user.email}`,
        }),
      })

      return user
    },
    async getUser(userId) {
      const data = await client.get({
        TableName,
        Key: {
          [pk]: `${EntitySlugs.user}${userId}`,
          [sk]: `${EntitySlugs.user}${userId}`,
        },
      })
      return from<AdapterUser>(data.Item)
    },
    async getUserByEmail(email) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.user}${email}`,
          ":gsi1sk": `${EntitySlugs.user}${email}`,
        },
      })

      return from<AdapterUser>(data.Items?.[0])
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.account}${provider}`,
          ":gsi1sk": `${EntitySlugs.account}${providerAccountId}`,
        },
      })
      if (!data.Items?.length) return null

      const accounts = data.Items[0] as AdapterAccount
      const res = await client.get({
        TableName,
        Key: {
          [pk]: `${EntitySlugs.user}${accounts.userId}`,
          [sk]: `${EntitySlugs.user}${accounts.userId}`,
        },
      })
      return from<AdapterUser>(res.Item)
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
          [pk]: `${EntitySlugs.user}${user.id}`,
          [sk]: `${EntitySlugs.user}${user.id}`,
        },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return from<AdapterUser>(data.Attributes)!
    },
    async deleteUser(userId) {
      // query all the items related to the user to delete
      const res = await client.query({
        TableName,
        KeyConditionExpression: "#pk = :pk",
        ExpressionAttributeNames: { "#pk": pk },
        ExpressionAttributeValues: { ":pk": `${EntitySlugs.user}${userId}` },
      })
      if (!res.Items) return null
      const items = res.Items
      // find the user we want to delete to return at the end of the function call
      const user = items.find((item) => item[EntityTagName] === EntityTags.user)
      const itemsToDelete = items.map((item) => {
        return {
          DeleteRequest: {
            Key: {
              [sk]: item[sk],
              [pk]: item[pk],
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
      return from<AdapterUser>(user)
    },
    async linkAccount(data) {
      const item = {
        ...data,
        id: crypto.randomUUID(),
        [pk]: `${EntitySlugs.user}${data.userId}`,
        [sk]: `${EntitySlugs.account}${data.provider}#${data.providerAccountId}`,
        [GSI1PK]: `${EntitySlugs.account}${data.provider}`,
        [GSI1SK]: `${EntitySlugs.account}${data.providerAccountId}`,
      }
      await client.put({ TableName, Item: format.to(item) })
      return data
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.account}${provider}`,
          ":gsi1sk": `${EntitySlugs.account}${providerAccountId}`,
        },
      })
      const account = from<AdapterAccount>(data.Items?.[0])
      if (!account) return
      await client.delete({
        TableName,
        Key: {
          [pk]: `${EntitySlugs.user}${account.userId}`,
          [sk]: `${EntitySlugs.account}${provider}#${providerAccountId}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return account
    },
    async getSessionAndUser(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.session}${sessionToken}`,
          ":gsi1sk": `${EntitySlugs.session}${sessionToken}`,
        },
      })
      const session = from<AdapterSession>(data.Items?.[0])
      if (!session) return null
      const res = await client.get({
        TableName,
        Key: {
          [pk]: `${EntitySlugs.user}${session.userId}`,
          [sk]: `${EntitySlugs.user}${session.userId}`,
        },
      })
      const user = from<AdapterUser>(res.Item)
      if (!user) return null
      return { user, session }
    },
    async createSession(data) {
      const session = {
        id: crypto.randomUUID(),
        ...data,
      }
      await client.put({
        TableName,
        Item: format.to({
          [pk]: `${EntitySlugs.user}${data.userId}`,
          [sk]: `${EntitySlugs.session}${data.sessionToken}`,
          [GSI1SK]: `${EntitySlugs.session}${data.sessionToken}`,
          [GSI1PK]: `${EntitySlugs.session}${data.sessionToken}`,
          [EntityTagName]: EntityTags.session,
          ...data,
        }),
      })
      return session
    },
    async updateSession(session) {
      const { sessionToken } = session
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.session}${sessionToken}`,
          ":gsi1sk": `${EntitySlugs.session}${sessionToken}`,
        },
      })
      if (!data.Items?.length) return null
      const sessionRecord = data.Items[0]
      const {
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
      } = generateUpdateExpression(session)
      const res = await client.update({
        TableName,
        Key: {
          [pk]: sessionRecord[pk],
          [sk]: sessionRecord[sk],
        },
        UpdateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
      return from<AdapterSession>(res.Attributes)
    },
    async deleteSession(sessionToken) {
      const data = await client.query({
        TableName,
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
        },
        ExpressionAttributeValues: {
          ":gsi1pk": `${EntitySlugs.session}${sessionToken}`,
          ":gsi1sk": `${EntitySlugs.session}${sessionToken}`,
        },
      })
      if (!data?.Items?.length) return null

      const sessionRecord = data.Items[0]

      const res = await client.delete({
        TableName,
        Key: {
          [pk]: sessionRecord[pk],
          [sk]: sessionRecord[sk],
        },
        ReturnValues: "ALL_OLD",
      })
      return from<AdapterSession>(res.Attributes)
    },
    async createVerificationToken(data) {
      await client.put({
        TableName,
        Item: format.to({
          [pk]: `${EntitySlugs.vt}${data.identifier}`,
          [sk]: `${EntitySlugs.vt}${data.token}`,
          [EntityTagName]: EntityTags.vt,
          ...data,
        }),
      })
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const data = await client.delete({
        TableName,
        Key: {
          [pk]: `${EntitySlugs.vt}${identifier}`,
          [sk]: `${EntitySlugs.vt}${token}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return from<VerificationToken>(data.Attributes)
    },
  }
}

const format = {
  /** Takes a plain old JavaScript object and turns it into a DynamoDB object */
  to(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Date) {
        // DynamoDB requires the TTL attribute be a UNIX timestamp (in secs).
        if (key === "expires") newObject[key] = value.getTime() / 1000
        else newObject[key] = value.toISOString()
      } else newObject[key] = value
    }
    return newObject
  },
  /** Takes a set of options; Returns a function that takes a Dynamo object and returns a plain old JavaScript object */
  from(formatOptions: DynamoDBAdapterFormatOptions) {
    const entities = Object.entries(formatOptions.EntityTags).map((e) => e[1])
    function innerFrom<T = Record<string, unknown>>(
      object?: Record<string, any>
    ): T | null {
      if (!object) return null
      const newObject: Record<string, unknown> = {}
      for (const key in object) {
        // Filter DynamoDB specific attributes so it doesn't get passed to core,
        // to avoid revealing the type of database
        if (formatOptions.dynamoKeys.includes(key)) continue

        const value = object[key]

        if (isDate(value)) newObject[key] = new Date(value)
        // hack to keep type property in account
        else if (
          key === formatOptions.EntityTagName &&
          entities.includes(value)
        ) {
          if (value === formatOptions.EntityTags.account) {
            newObject["type"] = "ACCOUNT"
          } else {
            continue
          }
        }
        // The expires property is stored as a UNIX timestamp in seconds, but
        // JavaScript needs it in milliseconds, so multiply by 1000.
        else if (key === "expires" && typeof value === "number")
          newObject[key] = new Date(value * 1000)
        else newObject[key] = value
      }
      return newObject as T
    }
    return innerFrom
  },
}

function generateUpdateExpression(object: Record<string, any>): {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
} {
  const formattedSession = format.to(object)
  let UpdateExpression = "set"
  const ExpressionAttributeNames: Record<string, string> = {}
  const ExpressionAttributeValues: Record<string, unknown> = {}
  for (const property in formattedSession) {
    UpdateExpression += ` #${property} = :${property},`
    ExpressionAttributeNames["#" + property] = property
    ExpressionAttributeValues[":" + property] = formattedSession[property]
  }
  UpdateExpression = UpdateExpression.slice(0, -1)
  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  }
}

export { format, generateUpdateExpression }
