import { runBasicTests } from "utils/adapter"
import { RemultAdapter } from "../src"
import { User, Account, Session, VerificationToken } from "../src/entities"

import { InMemoryDataProvider, remult, repo } from "remult"

// const db = await createPostgresConnection({
//   connectionString: "postgres://postgres:MASTERKEY@127.0.0.1/postgres",
//   orderByNullsFirst: true,
// })
// await db.ensureSchema([
//   repo(User).metadata,
//   repo(Account).metadata,
//   repo(Session).metadata,
//   repo(VerificationToken).metadata,
// ])

remult.dataProvider = new InMemoryDataProvider()

await repo(User).deleteMany({ where: { id: { $ne: "-1" } } })
await repo(Account).deleteMany({ where: { id: { $ne: "-1" } } })
await repo(Session).deleteMany({ where: { userId: { $ne: "-1" } } })
await repo(VerificationToken).deleteMany({
  where: { identifier: { $ne: "-1" } },
})

runBasicTests({
  adapter: RemultAdapter(),
  db: {
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
  },
})
