import { vi } from "vitest"
import { DataSource } from "typeorm"
import type { DataSourceOptions } from "typeorm"
import type { TestOptions } from "utils/adapter"
import * as defaultEntities from "../src/entities"
import { parseDataSourceConfig } from "../src/utils"

export { defaultEntities }

console.warn = vi.fn()

/** Set up Test Database */
export function db(
  config: string | DataSourceOptions,
  entities: typeof defaultEntities = defaultEntities
): TestOptions["db"] {
  const connection = new DataSource({
    ...parseDataSourceConfig(config),
    entities: Object.values(entities),
  }).manager.connection

  const m = connection.manager
  return {
    connect: async () => await connection.initialize(),
    disconnect: async () => await connection.destroy(),
    async user(id) {
      const user = await m.findOne(entities.UserEntity, { where: { id } })
      return user ?? null
    },
    async account(provider_providerAccountId) {
      const account = await m.findOne(entities.AccountEntity, {
        where: provider_providerAccountId,
      })
      return account ?? null
    },
    async session(sessionToken) {
      const session = await m.findOne(entities.SessionEntity, {
        where: { sessionToken },
      })
      return session ?? null
    },
    async verificationToken(token_identifier) {
      const verificationToken = await m.findOne(
        entities.VerificationTokenEntity,
        { where: token_identifier }
      )
      if (!verificationToken) return null
      const { id: _, ...rest } = verificationToken
      return rest
    },
  }
}
