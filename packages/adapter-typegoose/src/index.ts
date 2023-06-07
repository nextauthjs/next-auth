/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://typegoose.github.io">Typegoose</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://typegoose.github.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/typegoose.svg" width="30" />
 *  </a>
 * </div>
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @auth/typegoose-adapter @typegoose/typegoose mongoose
 * ```
 *
 * @module @auth/typegoose-adapter
 */

import { type Connection, ConnectionStates } from "mongoose"
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import type { IModelOptions } from "@typegoose/typegoose/lib/types"

import { getModelForClass } from "@typegoose/typegoose"
import {
  AccountSchema,
  SessionSchema,
  UserSchema,
  VerificationTokenSchema,
} from "./schemas"
import { instanceToPlain, plainToClass } from "class-transformer"

export interface TypegooseAdapterOptions {
  connection: Connection
  options?: Partial<{
    dbName: string
  }>
}

export function TypegooseAdapter({
  connection,
  options,
}: TypegooseAdapterOptions): Adapter {
  const db = (async () => {
    let _conn =
      connection.readyState !== ConnectionStates.connected
        ? await connection.asPromise()
        : connection
    if (options?.dbName) {
      _conn = await _conn.useDb(options.dbName).asPromise()
    }
    const modelOptions: IModelOptions = {
      existingConnection: _conn,
    }
    const UModel = getModelForClass(UserSchema, modelOptions)
    const VModel = getModelForClass(VerificationTokenSchema, modelOptions)
    return {
      U: UModel,
      V: VModel,
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
