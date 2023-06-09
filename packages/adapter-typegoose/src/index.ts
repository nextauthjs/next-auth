/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://typegoose.github.io">Typegoose</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://typegoose.github.io">
 *   <img style={{display: "block"}} src="/img/adapters/typegoose.svg" width="150" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @auth/typegoose-adapter @typegoose/typegoose mongoose
 * ```
 *
 * @module @auth/typegoose-adapter
 */

import type { Connection } from "mongoose"
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

import { buildSchema } from "@typegoose/typegoose"
import {
  AccountSchema,
  SessionSchema,
  UserSchema,
  VerificationTokenSchema,
} from "./schemas"
import { instanceToPlain, plainToClass } from "class-transformer"
import { Awaitable } from "@auth/core/types"
import type {
  AnyParamConstructor,
  BeAnObject,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types"

export interface AdapterSchema<T extends AnyParamConstructor<any>> {
  modelName: string
  schema: ReturnType<typeof buildSchema<T>>
}

/** This is the interface for the Typegoose adapter options. */
export interface TypegooseAdapterOptions {
  /**
   * The {@link https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#existingconnection Connection} you want to use for the MongoDB database.
   */
  connection: Awaitable<Connection>
  /**
   * The optional schemas to override the default schemas.
   */
  schemas?: Partial<{
    UserSchema: AdapterSchema<typeof UserSchema>
    AccountSchema: AdapterSchema<typeof AccountSchema>
    SessionSchema: AdapterSchema<typeof SessionSchema>
    VerificationTokenSchema: AdapterSchema<typeof VerificationTokenSchema>
  }>
  /**
   * The optional options for the adapter.
   * @property {string} dbName The DB name you want to connect to the MongoDB database.
   */
  options?: Partial<{
    /**
     * The DB name you want to connect to the MongoDB database
     */
    dbName: string
  }>
}

// deep required of type TypegooseAdapterOptions['schemas']
type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T[P] extends object
    ? DeepRequired<T[P]>
    : T[P]
}

export const defaultSchemas: DeepRequired<TypegooseAdapterOptions["schemas"]> =
  {
    UserSchema: {
      modelName: UserSchema.name,
      schema: buildSchema(UserSchema),
    },
    AccountSchema: {
      modelName: AccountSchema.name,
      schema: buildSchema(AccountSchema),
    },
    SessionSchema: {
      modelName: SessionSchema.name,
      schema: buildSchema(SessionSchema),
    },
    VerificationTokenSchema: {
      modelName: VerificationTokenSchema.name,
      schema: buildSchema(VerificationTokenSchema),
    },
  }

/**
 * ## Setup
 *
 * Configure Auth.js with Typegoose Adapter:
 *
 * ```typescript
 * import NextAuth from "next-auth"
 * import { TypegooseAdapter } from "@auth/typegoose-adapter"
 *
 * export default NextAuth({
 *  adapter: TypegooseAdapter({
 *   connection: mongoose.createConnection("mongodb://localhost:27017/mydb", {
 *    useNewUrlParser: true,
 *    useUnifiedTopology: true,
 *   })
 *  }),
 *  // ...
 * })
 * ```
 * `TypegooseAdapter` takes a [`Connection`](https://typegoose.github.io/typegoose/docs/api/decorators/model-options/#existingconnection) and an optional `options.dbName` as parameters.
 *
 */
export function TypegooseAdapter({
  connection,
  schemas,
  options: _options,
}: TypegooseAdapterOptions): Adapter {
  let _connection: Connection | null = null
  const s = {
    UserSchema: schemas?.UserSchema ?? defaultSchemas!.UserSchema,
    AccountSchema: schemas?.AccountSchema ?? defaultSchemas!.AccountSchema,
    SessionSchema: schemas?.SessionSchema ?? defaultSchemas!.SessionSchema,
    VerificationTokenSchema:
      schemas?.VerificationTokenSchema ??
      defaultSchemas!.VerificationTokenSchema,
  }
  const db = (async () => {
    if (!_connection) _connection = await connection
    const UModel =
      _connection.models[s.UserSchema.modelName] ??
      _connection.model(s.UserSchema.modelName, s.UserSchema.schema)
    const VModel =
      _connection.models[s.VerificationTokenSchema.modelName] ??
      _connection.model(
        s.VerificationTokenSchema.modelName,
        s.VerificationTokenSchema.schema
      )
    return {
      U: UModel as ReturnModelType<typeof UserSchema, BeAnObject>,
      V: VModel as ReturnModelType<typeof VerificationTokenSchema, BeAnObject>,
    }
  })()
  return {
    createUser: async (user) => {
      const _db = await db
      const newUser = await _db.U.create(user)
      const serialized = instanceToPlain(plainToClass(UserSchema, newUser))
      return serialized as AdapterUser
    },
    getUser: async (id) => {
      const user = await (await db).U.findById(id).exec()
      if (!user) return null
      const serialized = instanceToPlain(plainToClass(UserSchema, user))
      return serialized as AdapterUser
    },
    getUserByEmail: async (email) => {
      const user = await (await db).U.findOne({ email }).exec()
      if (!user) return null
      const serialized = instanceToPlain(plainToClass(UserSchema, user))
      return serialized as AdapterUser
    },
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const user = await (
        await db
      ).U.findOne({
        accounts: {
          $elemMatch: {
            provider,
            providerAccountId,
          },
        },
      }).exec()
      if (!user) return null
      const serialized = instanceToPlain(plainToClass(UserSchema, user))
      return serialized as AdapterUser
    },
    updateUser: async (user) => {
      const { id, ...data } = user
      const updatedUser = await (
        await db
      ).U.findByIdAndUpdate(id, data, {
        new: true,
      }).exec()
      const serialized = instanceToPlain(
        plainToClass(UserSchema, updatedUser ?? {})
      )
      return serialized as AdapterUser
    },
    deleteUser: async (userId) => {
      const oldUser = await (await db).U.findByIdAndDelete(userId).exec()
      if (!oldUser) return null
      const serialized = instanceToPlain(plainToClass(UserSchema, oldUser))
      return serialized as AdapterUser
    },
    createSession: async (session) => {
      const newSession = plainToClass(SessionSchema, session)
      await (
        await db
      ).U.findByIdAndUpdate(
        session.userId,
        {
          $push: {
            sessions: newSession,
          },
        },
        {
          new: true,
        }
      ).exec()
      const serialized = instanceToPlain(newSession)
      return serialized as AdapterSession
    },
    getSessionAndUser: async (sessionToken) => {
      const user = await (
        await db
      ).U.findOne({
        sessions: {
          $elemMatch: {
            sessionToken,
          },
        },
      }).exec()
      if (!user) return null
      const session = user.sessions.find(
        (session) => session.sessionToken === sessionToken
      )
      const serializedUser = instanceToPlain(plainToClass(UserSchema, user))
      const serializedSession = instanceToPlain(
        plainToClass(SessionSchema, session)
      )
      return {
        user: serializedUser as AdapterUser,
        session: serializedSession as AdapterSession,
      }
    },
    updateSession: async (session) => {
      await (
        await db
      ).U.findOneAndUpdate(
        {
          "sessions.sessionToken": session.sessionToken,
        },
        {
          $set: {
            "sessions.$": session,
          },
        },
        {
          new: true,
        }
      ).exec()
      const serialized = instanceToPlain(plainToClass(SessionSchema, session))
      return serialized as AdapterSession
    },
    deleteSession: async (sessionToken) => {
      const user = await (
        await db
      ).U.findOneAndUpdate(
        {
          "sessions.sessionToken": sessionToken,
        },
        {
          $pull: {
            sessions: {
              sessionToken,
            },
          },
        }
      ).exec()
      if (!user) return null
      const session = user.sessions.find(
        (session) => session.sessionToken === sessionToken
      )
      const serialized = instanceToPlain(plainToClass(SessionSchema, session))
      return serialized as AdapterSession
    },
    linkAccount: async (account) => {
      const user = await (
        await db
      ).U.findByIdAndUpdate(
        account.userId,
        {
          $push: {
            accounts: account,
          },
        },
        { new: true }
      ).exec()
      if (!user) return null
      const newAccount = user.accounts.find(
        (acc) => acc.providerId === account.providerId
      )
      const serialized = instanceToPlain(
        plainToClass(AccountSchema, newAccount)
      )
      return serialized as AdapterAccount
    },
    unlinkAccount: async ({ provider, providerAccountId }) => {
      const user = await (
        await db
      ).U.findOneAndUpdate(
        {
          accounts: {
            $elemMatch: {
              provider,
              providerAccountId,
            },
          },
        },
        {
          $pull: {
            accounts: {
              provider,
              providerAccountId,
            },
          },
        },
        {
          new: true,
        }
      )
      if (!user) return undefined
      const deletedAccount = user.accounts.find(
        (acc) =>
          acc.providerId === providerAccountId && acc.provider === provider
      )
      const serialized = instanceToPlain(
        plainToClass(AccountSchema, deletedAccount)
      )
      return serialized as AdapterAccount
    },
    createVerificationToken: async (verificationToken) => {
      const newToken = await (await db).V.create(verificationToken)
      const serialized = instanceToPlain(
        plainToClass(VerificationTokenSchema, newToken)
      )
      return serialized as VerificationToken
    },
    useVerificationToken: async (data) => {
      const token = await (await db).V.findOneAndDelete(data)
      if (!token) return null
      const serialized = instanceToPlain(
        plainToClass(VerificationTokenSchema, token)
      )
      return serialized as VerificationToken
    },
  }
}

export {
  AccountSchema,
  SessionSchema,
  UserSchema,
  VerificationTokenSchema,
} from "./schemas"
