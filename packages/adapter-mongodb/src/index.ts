/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://www.mongodb.com">MongoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.mongodb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/mongodb.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/mongodb-adapter mongodb
 * ```
 *
 * @module @auth/mongodb-adapter
 */
import { ObjectId } from "mongodb"

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import type { MongoClient } from "mongodb"

/**
 * This adapter uses https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management.
 * This feature is very new and requires runtime polyfills for `Symbol.asyncDispose` in order to work properly in all environments.
 * It is also required to set in the `tsconfig.json` file the compilation target to `es2022` or below and configure the `lib` option to include `esnext` or `esnext.disposable`.
 *
 * You can find more information about this feature and the polyfills in the link above.
 */
// @ts-expect-error read only property is not assignable
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose")

/** This is the interface of the MongoDB adapter options. */
export interface MongoDBAdapterOptions {
  /**
   * The name of the {@link https://www.mongodb.com/docs/manual/core/databases-and-collections/#collections MongoDB collections}.
   */
  collections?: {
    Users?: string
    Accounts?: string
    Sessions?: string
    VerificationTokens?: string
  }
  /**
   * The name you want to give to the MongoDB database
   */
  databaseName?: string
  /**
   * Callback function for managing the closing of the MongoDB client.
   * This could be useful when `client` is provided as a function returning MongoClient | Promise<MongoClient>.
   * It allows for more customized management of database connections,
   * addressing persistence, container reuse, and connection closure issues.
   */
  onClose?: (client: MongoClient) => Promise<void>
}

export const defaultCollections: Required<
  Required<MongoDBAdapterOptions>["collections"]
> = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
}



export const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
      const newObject: Record<string, unknown> = {}
      for (const key in object) {
          const value = object[key]
          if (key === "_id") {
              // Check if the value is an instance of ObjectId
              if (value instanceof ObjectId) {
                  newObject.id = value.toHexString()
              } else {
                  // If it's already a string, just use it directly
                  newObject.id = value
              }
          } else if (key === "userId") {
              if (value instanceof ObjectId) {
                  newObject[key] = value.toHexString()
              } else {
                  newObject[key] = value
              }
          } else {
              newObject[key] = value
          }
      }
      return newObject as T
  },
  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to<T = Record<string, unknown>>(object: Record<string, any>) {
      const newObject: Record<string, unknown> = {
          _id: _id(object.id),
      }
      for (const key in object) {
          const value = object[key]
          if (key === "userId") {
              newObject[key] = _id(value)
          } else {
              newObject[key] = value
          }
      }
      return newObject as T
  },
}





/** @internal */
export function _id(value?: string | ObjectId): ObjectId {
  if (value instanceof ObjectId) {
      // If value is already an ObjectId, return it as is
      return value;
  }

  if (typeof value === 'string' && value.length === 24) {
      // If value is a string and has a length of 24, assume it is a valid hex string
      return new ObjectId(value);
  }

  // Return a new ObjectId if no valid hex string is provided
  return new ObjectId();
}



export function MongoDBAdapter(
  /**
   * The MongoDB client.
   *
   * The MongoDB team recommends providing a non-connected `MongoClient` instance to avoid unhandled promise rejections if the client fails to connect.
   *
   * Alternatively, you can also pass:
   * - A promise that resolves to a connected `MongoClient` (not recommended).
   * - A function, to handle more complex and custom connection strategies.
   *
   * Using a function that returns `MongoClient | Promise<MongoClient>`, combined with `options.onClose`, can be useful when you want a more advanced and customized connection strategy to address challenges related to persistence, container reuse, and connection closure.
   */
  client:
    | MongoClient
    | Promise<MongoClient>
    | (() => MongoClient | Promise<MongoClient>),
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options
  const { from, to } = format

  const getDb = async () => {
    const _client: MongoClient = await (typeof client === "function"
      ? client()
      : client)
    const _db = _client.db(options.databaseName)
    const c = { ...defaultCollections, ...collections }
    return {
      U: _db.collection<AdapterUser>(c.Users),
      A: _db.collection<AdapterAccount>(c.Accounts),
      S: _db.collection<AdapterSession>(c.Sessions),
      V: _db.collection<VerificationToken>(c?.VerificationTokens),
      [Symbol.asyncDispose]: async () => {
        await options.onClose?.(_client)
      },
    }
  }

  return {
    async createUser(data) {
      const user = to<AdapterUser>(data)
      await using db = await getDb()
      await db.U.insertOne(user)
      return from<AdapterUser>(user)
    },
    async getUser(id) {
      await using db = await getDb()
      const user = await db.U.findOne({ _id: _id(id) })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async getUserByEmail(email) {
      await using db = await getDb()
      const user = await db.U.findOne({ email })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async getUserByAccount(provider_providerAccountId) {
      await using db = await getDb()
      const account = await db.A.findOne(provider_providerAccountId)
      if (!account) return null
      const user = await db.U.findOne({ _id: new ObjectId(account.userId) })
      if (!user) return null
      return from<AdapterUser>(user)
    },
    async updateUser(data) {
      const { _id, ...user } = to<AdapterUser>(data)
      await using db = await getDb()
      const result = await db.U.findOneAndUpdate(
        { _id },
        { $set: user },
        { returnDocument: "after" }
      )

      return from<AdapterUser>(result!)
    },
    async deleteUser(id) {
      const userId = _id(id)
      await using db = await getDb()
      await Promise.all([
        db.A.deleteMany({ userId: userId as any }),
        db.S.deleteMany({ userId: userId as any }),
        db.U.deleteOne({ _id: userId }),
      ])
    },
    linkAccount: async (data) => {
      const account = to<AdapterAccount>(data)
      await using db = await getDb()
      await db.A.insertOne(account)
      return account
    },
    async unlinkAccount(provider_providerAccountId) {
      await using db = await getDb()
      const account = await db.A.findOneAndDelete(provider_providerAccountId)
      return from<AdapterAccount>(account!)
    },
    async getSessionAndUser(sessionToken) {
      await using db = await getDb()
      const session = await db.S.findOne({ sessionToken })
      if (!session) return null
      const user = await db.U.findOne({ _id: new ObjectId(session.userId) })
      if (!user) return null
      return {
        user: from<AdapterUser>(user),
        session: from<AdapterSession>(session),
      }
    },
    async createSession(data) {
      const session = to<AdapterSession>(data)
      await using db = await getDb()
      await db.S.insertOne(session)
      return from<AdapterSession>(session)
    },
    async updateSession(data) {
      const { _id, ...session } = to<AdapterSession>(data)
      await using db = await getDb()
      const updatedSession = await db.S.findOneAndUpdate(
        { sessionToken: session.sessionToken },
        { $set: session },
        { returnDocument: "after" }
      )
      return from<AdapterSession>(updatedSession!)
    },
    async deleteSession(sessionToken) {
      await using db = await getDb()
      const session = await db.S.findOneAndDelete({
        sessionToken,
      })
      return from<AdapterSession>(session!)
    },
    async createVerificationToken(data) {
      await using db = await getDb()
      await db.V.insertOne(to(data))
      return data
    },
    async useVerificationToken(identifier_token) {
      await using db = await getDb()
      const verificationToken = await db.V.findOneAndDelete(identifier_token)
      if (!verificationToken) return null
      const { _id, ...rest } = verificationToken
      return rest
    },
  }
}

























const CallDataApi = async (endpoint : String, method : String, body: any) => {
  body.dataSource = body?.dataSource ?? process.env.MONGO_CLUSTER_NAME;


  if (body?.filter && body.filter._id) {
      console.log('body.filter._id', body.filter._id)
      // Match _id with either the provided string or its ObjectId equivalent
      body.filter._id = {
          "$in": [
              body.filter._id,
              { "$oid": body.filter._id }
          ]
      };
  }

  // Handle createdAt and updatedAt fields
  const currentDate = { "$date": new Date().toISOString() }

  if (endpoint.includes('insertOne') || endpoint.includes('insertMany')) {
      // Set createdAt and updatedAt for inserts
      if (endpoint.includes('insertOne')) {
          body.document.createdAt = currentDate;
          body.document.updatedAt = currentDate;
      } else if (endpoint.includes('insertMany')) {
          body.documents.forEach(doc => {
              doc.createdAt = currentDate;
              doc.updatedAt = currentDate;
          });
      }
  } else if (endpoint.includes('updateOne') || endpoint.includes('updateMany')) {

      // Set updatedAt for updates
      if (!body.update.$set) {
          body.update.$set = {};
      }

      body.update.$set.updatedAt = currentDate;

      // Ensure createdAt is only set on insert for upserts
      if (body.update.$setOnInsert) {
          body.update.$setOnInsert.createdAt = currentDate;
      } else {
          body.update.$setOnInsert = { createdAt: currentDate };
      }
  }

  try {
      const response = await fetch(`https://data.mongodb-api.com/app/data-piovb/endpoint/data/v1/action/${endpoint}`, {
          method,
          headers: {
              'Content-Type': 'application/ejson',
              'Accept': 'application/json',
              'api-Key': process.env.MONGODB_API_KEY,
          },
          body: JSON.stringify(body),
      });

      if (!response.ok) {
          const errorMessage = `Error: ${response.statusText}`;
          console.error('API call failed:', errorMessage, {
              endpoint,
              method,
              body,
              status: response.status,
              statusText: response.statusText,
          });
          throw new Error(errorMessage);
      }

      const data = await response.json();

      if (Object?.keys(data)?.includes('document') || Object?.keys(data)?.includes('documents')) {
          return data?.documents ?? data?.document;
      }
      return data
  } catch (error) {
      console.error('Error calling data API:', error);
      throw error;
  }
};




export function MongoDBDataApiAdapter(
  dataApiOptions: { clusterName?: string, databaseName: string },
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options
  const { from, to } = format

  const db = {
      clusterName: dataApiOptions?.clusterName ?? process.env.MONGO_CLUSTER_NAME,
      databaseName: dataApiOptions.databaseName,
      collections: { ...defaultCollections, ...collections }
  }

  return {
      async createUser(data) {
          const user = to<AdapterUser>(data)
          await CallDataApi('insertOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              document: user,
          });
          return from<AdapterUser>(user)
      },
      async getUser(id) {
          const user = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { _id: _id(id) },
          });
          if (!user) return null
          return from<AdapterUser>(user)
      },
      async getUserByEmail(email) {
          const user = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { email },
          });
          if (!user) return null
          return from<AdapterUser>(user)
      },
      async getUserByAccount(provider_providerAccountId) {
          console.log('provider_providerAccountId', provider_providerAccountId)
          const account = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Accounts,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: provider_providerAccountId
          });
          console.log('account', account)
          if (!account) return null
          const user = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              // filter: { _id: { "$oid": account.userId } },
              filter: { _id: _id(account.userId) }
          });
          console.log('user', user)
          if (!user) return null
          return from<AdapterUser>(user)
      },
      async updateUser(data) {
          const user = to<AdapterUser>(data);
          await CallDataApi('updateOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { _id: _id(data.id) },
              update: { $set: data },
          });
          const { value: updatedUser } = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { _id: _id(data.id) },
          });
          return from<AdapterUser>(updatedUser)
      },
      async deleteUser(id) {
          const userId = _id(id);
          await Promise.all([
              CallDataApi('deleteMany', 'POST', {
                  collection: db.collections.Accounts,
                  database: db.databaseName,
                  dataSource: db.clusterName,
                  filter: { userId }
              }),
              CallDataApi('deleteMany', 'POST', {
                  collection: db.collections.Sessions,
                  database: db.databaseName,
                  dataSource: db.clusterName,
                  filter: { userId }
              }),
              CallDataApi('deleteOne', 'POST', {
                  collection: db.collections.Users,
                  database: db.databaseName,
                  dataSource: db.clusterName,
                  filter: { _id: userId }
              })
          ]);
      },
      async linkAccount(data) {
          const account = to<Account>(data);
          await CallDataApi('insertOne', 'POST', {
              collection: db.collections.Accounts,
              database: db.databaseName,
              dataSource: db.clusterName,
              document: account,
          });
          return account
      },
      async unlinkAccount(provider_providerAccountId) {
          const { value: account } = await CallDataApi('findOneAndDelete', 'POST', {
              collection: db.collections.Accounts,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: provider_providerAccountId,
              returnNewDocument: true
          });
          return from<Account>(account!)
      },
      async getSessionAndUser(sessionToken) {
          const session = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Sessions,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { sessionToken }
          });
          if (!session) return null
          const user = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Users,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { _id: _id(session.userId) }
          });
          if (!user) return null
          return {
              user: from<AdapterUser>(user),
              session: from<AdapterSession>(session),
          }
      },
      async createSession(data) {
          const session = to<AdapterSession>(data);
          await CallDataApi('insertOne', 'POST', {
              collection: db.collections.Sessions,
              database: db.databaseName,
              dataSource: db.clusterName,
              document: session,
          });
          return from<AdapterSession>(session)
      },
      async updateSession(data) {
          const session = to<AdapterSession>(data);

          await CallDataApi('updateOne', 'POST', {
              collection: db.collections.Sessions,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { sessionToken: data.sessionToken },
              update: { $set: data },
          })

          const { value: updatedSession } = await CallDataApi('findOne', 'POST', {
              collection: db.collections.Sessions,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { sessionToken: data.sessionToken },
          })
          return from<AdapterSession>(updatedSession)
      },
      async deleteSession(sessionToken) {
          const { value: session } = await CallDataApi('findOneAndDelete', 'POST', {
              collection: db.collections.Sessions,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: { sessionToken },
              returnNewDocument: true
          });
          return from<AdapterSession>(session!)
      },
      async createVerificationToken(data) {
          await CallDataApi('insertOne', 'POST', {
              collection: db.collections.VerificationTokens,
              database: db.databaseName,
              dataSource: db.clusterName,
              document: to(data)
          });
          return data
      },
      async useVerificationToken(identifier_token) {
          const { value: verificationToken } = await CallDataApi('findOneAndDelete', 'POST', {
              collection: db.collections.VerificationTokens,
              database: db.databaseName,
              dataSource: db.clusterName,
              filter: identifier_token,
              returnNewDocument: true
          });
          if (!verificationToken) return null
          delete verificationToken._id
          return verificationToken
      }
  }
}
