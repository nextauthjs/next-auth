/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html">DynamoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://docs.aws.amazon.com/dynamodb/index.html">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/dynamodb.png" width="48"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @auth/dynamodb-adapter
 * ```
 *
 * @module @auth/dynamodb-adapter
 */

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
} from "@auth/core/adapters"

export interface DynamoDBAdapterOptions {
  tableName?: string
  partitionKey?: string
  sortKey?: string
  indexName?: string
  indexPartitionKey?: string
  indexSortKey?: string
}

/**
 * ## Setup
 *
 * By default, the adapter expects a table with a partition key `pk` and a sort key `sk`, as well as a global secondary index named `GSI1` with `GSI1PK` as partition key and `GSI1SK` as sorting key. To automatically delete sessions and verification requests after they expire using [dynamodb TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) you should [enable the TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/time-to-live-ttl-how-to.html) with attribute name 'expires'. You can set whatever you want as the table name and the billing method.
 * You can find the full schema in the table structure section below.
 *
 * ### Configuring Auth.js
 *
 * You need to pass `DynamoDBDocument` client from the modular [`aws-sdk`](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html) v3 to the adapter.
 * The default table name is `next-auth`, but you can customise that by passing `{ tableName: 'your-table-name' }` as the second parameter in the adapter.
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
 * import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
 * import NextAuth from "next-auth";
 * import Providers from "next-auth/providers";
 * import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
 *
 * const config: DynamoDBClientConfig = {
 *   credentials: {
 *     accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
 *     secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
 *   },
 *   region: process.env.NEXT_AUTH_AWS_REGION,
 * };
 *
 * const client = DynamoDBDocument.from(new DynamoDB(config), {
 *   marshallOptions: {
 *     convertEmptyValues: true,
 *     removeUndefinedValues: true,
 *     convertClassInstanceToMap: true,
 *   },
 * })
 *
 * export default NextAuth({
 *   // Configure one or more authentication providers
 *   providers: [
 *     Providers.GitHub({
 *       clientId: process.env.GITHUB_ID,
 *       clientSecret: process.env.GITHUB_SECRET,
 *     }),
 *     Providers.Email({
 *       server: process.env.EMAIL_SERVER,
 *       from: process.env.EMAIL_FROM,
 *     }),
 *     // ...add more providers here
 *   ],
 *   adapter: DynamoDBAdapter(
 *     client
 *   ),
 *   ...
 * });
 * ```
 *
 * (AWS secrets start with `NEXT_AUTH_` in order to not conflict with [Vercel's reserved environment variables](https://vercel.com/docs/environment-variables#reserved-environment-variables).)
 *
 * ## Advanced usage
 *
 * ### Default schema
 *
 * The table respects the single table design pattern. This has many advantages:
 *
 * - Only one table to manage, monitor and provision.
 * - Querying relations is faster than with multi-table schemas (for eg. retrieving all sessions for a user).
 * - Only one table needs to be replicated if you want to go multi-region.
 *
 * > This schema is adapted for use in DynamoDB and based upon our main [schema](https://authjs.dev/reference/adapters#models)
 *
 * ![DynamoDB Table](https://i.imgur.com/hGZtWDq.png)
 *
 * You can create this table with infrastructure as code using [`aws-cdk`](https://github.com/aws/aws-cdk) with the following table definition:
 *
 * ```javascript title=stack.ts
 * new dynamodb.Table(this, `NextAuthTable`, {
 *   tableName: "next-auth",
 *   partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
 *   sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
 *   timeToLiveAttribute: "expires",
 * }).addGlobalSecondaryIndex({
 *   indexName: "GSI1",
 *   partitionKey: { name: "GSI1PK", type: dynamodb.AttributeType.STRING },
 *   sortKey: { name: "GSI1SK", type: dynamodb.AttributeType.STRING },
 * })
 * ```
 *
 * Alternatively, you can use this cloudformation template:
 *
 * ```yaml title=cloudformation.yaml
 * NextAuthTable:
 *   Type: "AWS::DynamoDB::Table"
 *   Properties:
 *     TableName: next-auth
 *     AttributeDefinitions:
 *       - AttributeName: pk
 *         AttributeType: S
 *       - AttributeName: sk
 *         AttributeType: S
 *       - AttributeName: GSI1PK
 *         AttributeType: S
 *       - AttributeName: GSI1SK
 *         AttributeType: S
 *     KeySchema:
 *       - AttributeName: pk
 *         KeyType: HASH
 *       - AttributeName: sk
 *         KeyType: RANGE
 *     GlobalSecondaryIndexes:
 *       - IndexName: GSI1
 *         Projection:
 *           ProjectionType: ALL
 *         KeySchema:
 *           - AttributeName: GSI1PK
 *             KeyType: HASH
 *           - AttributeName: GSI1SK
 *             KeyType: RANGE
 *     TimeToLiveSpecification:
 *       AttributeName: expires
 *       Enabled: true
 * ```
 *
 * ### Using a custom schema
 *
 * You can configure your custom table schema by passing the `options` key to the adapter constructor:
 *
 * ```javascript
 * const adapter = DynamoDBAdapter(client, {
 *   tableName: "custom-table-name",
 *   partitionKey: "custom-pk",
 *   sortKey: "custom-sk",
 *   indexName: "custom-index-name",
 *   indexPartitionKey: "custom-index-pk",
 *   indexSortKey: "custom-index-sk",
 * })
 * ```
 **/
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
          [pk]: `USER#${user.id}`,
          [sk]: `USER#${user.id}`,
          type: "USER",
          [GSI1PK]: `USER#${user.email}`,
          [GSI1SK]: `USER#${user.email}`,
        }),
      })

      return user
    },
    async getUser(userId) {
      const data = await client.get({
        TableName,
        Key: {
          [pk]: `USER#${userId}`,
          [sk]: `USER#${userId}`,
        },
      })
      return format.from<AdapterUser>(data.Item)
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
          ":gsi1pk": `USER#${email}`,
          ":gsi1sk": `USER#${email}`,
        },
      })

      return format.from<AdapterUser>(data.Items?.[0])
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
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      })
      if (!data.Items?.length) return null

      const accounts = data.Items[0] as AdapterAccount
      const res = await client.get({
        TableName,
        Key: {
          [pk]: `USER#${accounts.userId}`,
          [sk]: `USER#${accounts.userId}`,
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
          [pk]: `USER#${user.id}`,
          [sk]: `USER#${user.id}`,
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
        ExpressionAttributeNames: { "#pk": pk },
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
              [sk]: item.sk,
              [pk]: item.pk,
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
        id: crypto.randomUUID(),
        [pk]: `USER#${data.userId}`,
        [sk]: `ACCOUNT#${data.provider}#${data.providerAccountId}`,
        [GSI1PK]: `ACCOUNT#${data.provider}`,
        [GSI1SK]: `ACCOUNT#${data.providerAccountId}`,
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
          ":gsi1pk": `ACCOUNT#${provider}`,
          ":gsi1sk": `ACCOUNT#${providerAccountId}`,
        },
      })
      const account = format.from<AdapterAccount>(data.Items?.[0])
      if (!account) return
      await client.delete({
        TableName,
        Key: {
          [pk]: `USER#${account.userId}`,
          [sk]: `ACCOUNT#${provider}#${providerAccountId}`,
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
          ":gsi1pk": `SESSION#${sessionToken}`,
          ":gsi1sk": `SESSION#${sessionToken}`,
        },
      })
      const session = format.from<AdapterSession>(data.Items?.[0])
      if (!session) return null
      const res = await client.get({
        TableName,
        Key: {
          [pk]: `USER#${session.userId}`,
          [sk]: `USER#${session.userId}`,
        },
      })
      const user = format.from<AdapterUser>(res.Item)
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
          [pk]: `USER#${data.userId}`,
          [sk]: `SESSION#${data.sessionToken}`,
          [GSI1SK]: `SESSION#${data.sessionToken}`,
          [GSI1PK]: `SESSION#${data.sessionToken}`,
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
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
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
        IndexName,
        KeyConditionExpression: "#gsi1pk = :gsi1pk AND #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#gsi1pk": GSI1PK,
          "#gsi1sk": GSI1SK,
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
          [pk]: `VT#${data.identifier}`,
          [sk]: `VT#${data.token}`,
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
          [pk]: `VT#${identifier}`,
          [sk]: `VT#${token}`,
        },
        ReturnValues: "ALL_OLD",
      })
      return format.from<VerificationToken>(data.Attributes)
    },
  }
}

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

const format = {
  /** Takes a plain old JavaScript object and turns it into a Dynamodb object */
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
  /** Takes a Dynamo object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object?: Record<string, any>): T | null {
    if (!object) return null
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      // Filter DynamoDB specific attributes so it doesn't get passed to core,
      // to avoid revealing the type of database
      if (["pk", "sk", "GSI1PK", "GSI1SK"].includes(key)) continue

      const value = object[key]

      if (isDate(value)) newObject[key] = new Date(value)
      // hack to keep type property in account
      else if (key === "type" && ["SESSION", "VT", "USER"].includes(value))
        continue
      // The expires property is stored as a UNIX timestamp in seconds, but
      // JavaScript needs it in milliseconds, so multiply by 1000.
      else if (key === "expires" && typeof value === "number")
        newObject[key] = new Date(value * 1000)
      else newObject[key] = value
    }
    return newObject as T
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
