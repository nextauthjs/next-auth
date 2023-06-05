import { getModelForClass } from "@typegoose/typegoose"
import type { Connection } from "mongoose"
import type { Awaitable } from "next-auth"
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"
import { instanceToPlain, plainToClass } from "class-transformer"
import { UserSchema } from "./schemas/users"
import { SessionSchema } from "./schemas/sessions"
import { AccountSchema } from "./schemas/accounts"
import { VerificationTokenSchema } from "./schemas/verifycation-token"

export interface TypegooseAdapterOptions {
  connection: Awaitable<Connection>
  options?: Partial<{}>
}
export function TypegooseAdapter({
  connection,
}: TypegooseAdapterOptions): Adapter {
  const db = (async () => {
    let _db = await connection
    const modelOptions = {
      existingConnection: _db,
      schemaOptions: {
        timestamps: true,
      },
    }
    return {
      U: getModelForClass(UserSchema, modelOptions),
      V: getModelForClass(VerificationTokenSchema, modelOptions),
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
        plainToClass(UserSchema, updatedUser || {})
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
      const session = user.sessions!.find(
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
      const session = user.sessions!.find(
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
      const newAccount = user.accounts!.find(
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
      const deletedAccount = user.accounts!.find(
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
