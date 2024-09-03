import { runBasicTests } from "utils/adapter"
import { RemultAdapter } from "../src"
import {
  User,
  Account,
  Session,
  VerificationToken,
  Authenticator,
} from "../src/entities"

import { Fields, InMemoryDataProvider, remult, repo } from "remult"

// const db = await createPostgresConnection({
//   connectionString: "postgres://postgres:MASTERKEY@127.0.0.1/postgres",
//   orderByNullsFirst: true,
// })

// await db.ensureSchema([
//   repo(User).metadata,
//   repo(Account).metadata,
//   repo(Session).metadata,
//   repo(VerificationToken).metadata,
//   repo(Authenticator).metadata,
// ])

remult.dataProvider = new InMemoryDataProvider()

export class AppUser extends User {
  @Fields.boolean()
  isDisable!: boolean
}
export class AppAccount extends Account {
  @Fields.string()
  infoAccount!: string
}

export class AppSession extends Session {
  @Fields.string()
  infoSession!: string
}

export class AppAuthenticator extends Authenticator {
  @Fields.string()
  infoAuthenticator!: string
}

const resetDb = async () => {
  await repo(User).deleteMany({ where: { id: { $ne: "-1" } } })
  await repo(Account).deleteMany({ where: { id: { $ne: "-1" } } })
  await repo(Session).deleteMany({ where: { userId: { $ne: "-1" } } })
  await repo(VerificationToken).deleteMany({ where: { token: { $ne: "-1" } } })
  await repo(Authenticator).deleteMany({ where: { userId: { $ne: "-1" } } })
}

const { adapter } = RemultAdapter({
  customEntities: {
    User: AppUser,
    Account: AppAccount,
    Session: AppSession,
    Authenticator: AppAuthenticator,
  },
})

runBasicTests({
  testWebAuthnMethods: true,
  adapter,
  db: {
    async connect() {
      await resetDb()
    },
    async disconnect() {
      await resetDb()
    },
    user: async (id: string) => {
      return (await repo(User).findFirst({ id })) ?? null
    },
    account: async (account) => {
      return (
        (await repo(Account).findFirst({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })) ?? null
      )
    },
    session: async (sessionToken) => {
      return (
        (await repo(Session).findFirst({
          sessionToken,
        })) ?? null
      )
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
      return (
        (await repo(VerificationToken).findFirst({
          identifier,
          token,
        })) ?? null
      )
    },
    async authenticator(credentialID) {
      return await repo(Authenticator).findFirst({ credentialID })
    },
  },
})
