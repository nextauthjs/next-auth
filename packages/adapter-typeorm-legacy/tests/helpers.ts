import { ConnectionManager, ConnectionOptions } from "typeorm"
import { TestOptions } from "@next-auth/adapter-test"
import * as defaultEntities from "../src/entities"
import { parseConnectionConfig } from "../src/utils"

export { defaultEntities }

/** Set up Test Database */
export function db(
  config: string | ConnectionOptions,
  entities: typeof defaultEntities = defaultEntities
): TestOptions["db"] {
  const connection = new ConnectionManager().create({
    ...parseConnectionConfig(config),
    entities: Object.values(entities),
  })

  const m = connection.manager
  return {
    connect: async () => await connection.connect(),
    disconnect: async () => await connection.close(),
    async user(id) {
      const user = await m.findOne(entities.UserEntity, id)
      return user ?? null
    },
    async account(provider_providerAccountId) {
      const account = await m.findOne(
        entities.AccountEntity,
        provider_providerAccountId
      )
      return account ?? null
    },
    async session(sessionToken) {
      const session = await m.findOne(entities.SessionEntity, { sessionToken })
      return session ?? null
    },
    async verificationToken(token_identifier) {
      const verificationToken = await m.findOne(
        entities.VerificationTokenEntity,
        token_identifier
      )
      if (!verificationToken) return null
      // @ts-expect-error
      const { id: _, ...rest } = verificationToken
      return rest
    },
  }
}
