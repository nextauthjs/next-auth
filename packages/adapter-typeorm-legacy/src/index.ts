import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from "next-auth/adapters"
import { DataSourceOptions, DataSource, EntityManager } from "typeorm"
import * as defaultEntities from "./entities"
import { parseDataSourceConfig, updateConnectionEntities } from "./utils"

export const entities = defaultEntities

export type Entities = typeof entities

export interface TypeORMLegacyAdapterOptions {
  entities?: Entities
}

let _dataSource: DataSource | undefined

export async function getManager(options: {
  dataSource: string | DataSourceOptions
  entities: Entities
}): Promise<EntityManager> {
  const { dataSource, entities } = options

  const config = {
    ...parseDataSourceConfig(dataSource),
    entities: Object.values(entities),
  }

  if (!_dataSource) _dataSource = new DataSource(config)

  const manager = _dataSource?.manager

  if (!manager.connection.isInitialized) {
    await manager.connection.initialize()
  }

  if (process.env.NODE_ENV !== "production") {
    await updateConnectionEntities(_dataSource, config.entities)
  }
  return manager
}

export function TypeORMLegacyAdapter(
  dataSource: string | DataSourceOptions,
  options?: TypeORMLegacyAdapterOptions
): Adapter {
  const entities = options?.entities
  const c = {
    dataSource,
    entities: {
      UserEntity: entities?.UserEntity ?? defaultEntities.UserEntity,
      SessionEntity: entities?.SessionEntity ?? defaultEntities.SessionEntity,
      AccountEntity: entities?.AccountEntity ?? defaultEntities.AccountEntity,
      VerificationTokenEntity:
        entities?.VerificationTokenEntity ??
        defaultEntities.VerificationTokenEntity,
    },
  }

  return {
    /**
     * Method used in testing. You won't need to call this in your app.
     * @internal
     */
    async __disconnect() {
      const m = await getManager(c)
      await m.connection.close()
    },
    // @ts-expect-error
    createUser: async (data) => {
      const m = await getManager(c)
      const user = await m.save("UserEntity", data)
      return user
    },
    // @ts-expect-error
    async getUser(id) {
      const m = await getManager(c)
      const user = await m.findOne("UserEntity", { where: { id } })
      if (!user) return null
      return { ...user }
    },
    // @ts-expect-error
    async getUserByEmail(email) {
      const m = await getManager(c)
      const user = await m.findOne("UserEntity", { where: { email } })
      if (!user) return null
      return { ...user }
    },
    async getUserByAccount(provider_providerAccountId) {
      const m = await getManager(c)
      const account = await m.findOne<AdapterAccount & { user: AdapterUser }>(
        "AccountEntity",
        { where: provider_providerAccountId, relations: ["user"] }
      )
      if (!account) return null
      return account.user ?? null
    },
    // @ts-expect-error
    async updateUser(data) {
      const m = await getManager(c)
      const user = await m.save("UserEntity", data)
      return user
    },
    async deleteUser(id) {
      const m = await getManager(c)
      await m.transaction(async (tm) => {
        await tm.delete("AccountEntity", { userId: id })
        await tm.delete("SessionEntity", { userId: id })
        await tm.delete("UserEntity", { id })
      })
    },
    async linkAccount(data) {
      const m = await getManager(c)
      const account = await m.save("AccountEntity", data)
      return account
    },
    async unlinkAccount(providerAccountId) {
      const m = await getManager(c)
      await m.delete<AdapterAccount>("AccountEntity", providerAccountId)
    },
    async createSession(data) {
      const m = await getManager(c)
      const session = await m.save("SessionEntity", data)
      return session
    },
    async getSessionAndUser(sessionToken) {
      const m = await getManager(c)
      const sessionAndUser = await m.findOne<
        AdapterSession & { user: AdapterUser }
      >("SessionEntity", { where: { sessionToken }, relations: ["user"] })

      if (!sessionAndUser) return null
      const { user, ...session } = sessionAndUser
      return { session, user }
    },
    async updateSession(data) {
      const m = await getManager(c)
      await m.update("SessionEntity", { sessionToken: data.sessionToken }, data)
      // TODO: Try to return?
      return null
    },
    async deleteSession(sessionToken) {
      const m = await getManager(c)
      await m.delete("SessionEntity", { sessionToken })
    },
    async createVerificationToken(data) {
      const m = await getManager(c)
      const verificationToken = await m.save("VerificationTokenEntity", data)
      // @ts-expect-error
      delete verificationToken.id
      return verificationToken
    },
    // @ts-expect-error
    async useVerificationToken(identifier_token) {
      const m = await getManager(c)
      const verificationToken = await m.findOne("VerificationTokenEntity", {
        where: identifier_token,
      })
      if (!verificationToken) {
        return null
      }
      await m.delete("VerificationTokenEntity", identifier_token)
      // @ts-expect-error
      delete verificationToken.id
      return verificationToken
    },
  }
}
