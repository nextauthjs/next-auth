import { runBasicTests } from "@next-auth/adapter-test"
import {
  AccountSchema,
  SessionSchema,
  TypegooseAdapter,
  UserSchema,
  VerificationTokenSchema,
} from "../src"
import { Types, createConnection } from "mongoose"
import { instanceToPlain, plainToClass } from "class-transformer"

const name = "test"

const connectionPromise = createConnection(
  `mongodb://localhost:27017/${name}`,
  {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

runBasicTests({
  adapter: TypegooseAdapter({
    connection: connectionPromise,
  }) as any,
  db: {
    id: () => new Types.ObjectId().toString(),
    disconnect: async () => {
      await connectionPromise.db.dropDatabase()
      await connectionPromise.close()
    },
    account: async ({ provider, providerAccountId }) => {
      const user = await connectionPromise.models[UserSchema.name]
        .findOne({
          accounts: {
            $elemMatch: {
              provider,
              providerAccountId,
            },
          },
        })
        .select("accounts")
        .exec()
      if (!user) {
        return null
      }
      const account = user.accounts.find(
        (a: AccountSchema) =>
          a.provider === provider && a.providerAccountId === providerAccountId
      )
      const serialized = instanceToPlain(plainToClass(AccountSchema, account))
      return serialized
    },
    session: async (sessionToken) => {
      const user = await connectionPromise.models[UserSchema.name]
        .findOne({
          sessions: {
            $elemMatch: {
              sessionToken,
            },
          },
        })
        .select("sessions")
        .exec()
      if (!user) {
        return null
      }
      const session = user.sessions.find(
        (s: SessionSchema) => s.sessionToken === sessionToken
      )
      const serialized = instanceToPlain(plainToClass(SessionSchema, session))
      return serialized
    },
    user: async (id) => {
      const user = await connectionPromise.models[UserSchema.name]
        .findById(id)
        .exec()
      if (!user) {
        return null
      }
      const serialized = instanceToPlain(plainToClass(UserSchema, user))
      return serialized
    },
    verificationToken: async (token) => {
      const verificationToken = await connectionPromise.models[
        VerificationTokenSchema.name
      ]
        .findOne(token)
        .exec()
      if (!verificationToken) {
        return null
      }
      const serialized = instanceToPlain(
        plainToClass(VerificationTokenSchema, verificationToken)
      )
      return serialized
    },
  },
  skipTests: [],
})
