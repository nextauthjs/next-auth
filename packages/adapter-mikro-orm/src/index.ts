/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://mikro-orm.io/docs/installation">MikroORM</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://mikro-orm.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/mikro-orm.svg" width="64"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @mikro-orm/core @auth/mikro-orm-adapter
 * ```
 *
 * @module @auth/mikro-orm-adapter
 */
import type {
  Connection,
  IDatabaseDriver,
  Options as ORMOptions,
} from "@mikro-orm/core"

import type { Adapter } from "@auth/core/adapters"

import { MikroORM, wrap } from "@mikro-orm/core"

import * as defaultEntities from "./lib/entities.js"

export { defaultEntities }

export function MikroOrmAdapter<
  D extends IDatabaseDriver<Connection> = IDatabaseDriver<Connection>,
>(
  ormOptions: ORMOptions<D>,
  options?: {
    entities?: Partial<typeof defaultEntities>
  }
): Adapter {
  const UserModel = options?.entities?.User ?? defaultEntities.User
  const AccountModel = options?.entities?.Account ?? defaultEntities.Account
  const SessionModel = options?.entities?.Session ?? defaultEntities.Session
  const VerificationTokenModel =
    options?.entities?.VerificationToken ?? defaultEntities.VerificationToken

  let _orm: MikroORM

  const getEM = async () => {
    if (!_orm) {
      // filter out default entities from the passed entities
      const optionsEntities =
        ormOptions.entities?.filter((e) => {
          if (
            typeof e !== "string" &&
            "name" in e &&
            typeof e.name === "string"
          )
            return ![
              "User",
              "Account",
              "Session",
              "VerificationToken",
            ].includes(e.name)
          return true
        }) ?? []
      // add the (un-)enhanced entities to the connection
      ormOptions.entities = [
        ...optionsEntities,
        UserModel,
        AccountModel,
        SessionModel,
        VerificationTokenModel,
      ]
      _orm = await MikroORM.init(ormOptions)
    }
    return _orm.em.fork()
  }

  return {
    /**
     * Method used in testing. You won't need to call this in your app.
     * @internal
     */
    async __disconnect() {
      const em = await getEM()
      await em.getConnection().close()
    },
    async createUser(data) {
      const em = await getEM()
      const user = new UserModel()
      wrap(user).assign(data)
      await em.persistAndFlush(user)

      return wrap(user).toObject()
    },
    async getUser(id) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { id })
      if (!user) return null

      return wrap(user).toObject()
    },
    async getUserByEmail(email) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { email })
      if (!user) return null

      return wrap(user).toObject()
    },
    async getUserByAccount(provider_providerAccountId) {
      const em = await getEM()
      const account = await em.findOne(AccountModel, {
        ...provider_providerAccountId,
      })
      if (!account) return null
      const user = await em.findOne(UserModel, { id: account.userId })

      return wrap(user).toObject()
    },
    async updateUser(data) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { id: data.id })
      if (!user) throw new Error("User not found")
      wrap(user).assign(data, { mergeObjects: true })
      await em.persistAndFlush(user)

      return wrap(user).toObject()
    },
    async deleteUser(id) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { id })
      if (!user) return null
      await em.removeAndFlush(user)

      return wrap(user).toObject()
    },
    // @ts-expect-error
    async linkAccount(data) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { id: data.userId })
      if (!user) throw new Error("User not found")
      const account = new AccountModel()
      wrap(account).assign(data)
      user.accounts.add(account)
      await em.persistAndFlush(user)

      return wrap(account).toObject()
    },
    // @ts-expect-error
    async unlinkAccount(provider_providerAccountId) {
      const em = await getEM()
      const account = await em.findOne(AccountModel, {
        ...provider_providerAccountId,
      })
      if (!account) throw new Error("Account not found")
      await em.removeAndFlush(account)

      return wrap(account).toObject()
    },
    async getSessionAndUser(sessionToken) {
      const em = await getEM()
      const session = await em.findOne(
        SessionModel,
        { sessionToken },
        { populate: ["user"] }
      )
      if (!session || !session.user) return null

      return {
        user: wrap(session.user).toObject(),
        session: wrap(session).toObject(),
      }
    },
    async createSession(data) {
      const em = await getEM()
      const user = await em.findOne(UserModel, { id: data.userId })
      if (!user) throw new Error("User not found")
      const session = new SessionModel()
      wrap(session).assign(data)
      user.sessions.add(session)
      await em.persistAndFlush(user)

      return wrap(session).toObject()
    },
    async updateSession(data) {
      const em = await getEM()
      const session = await em.findOne(SessionModel, {
        sessionToken: data.sessionToken,
      })
      wrap(session).assign(data)
      if (!session) throw new Error("Session not found")
      await em.persistAndFlush(session)

      return wrap(session).toObject()
    },
    async deleteSession(sessionToken) {
      const em = await getEM()
      const session = await em.findOne(SessionModel, {
        sessionToken,
      })
      if (!session) return null
      await em.removeAndFlush(session)

      return wrap(session).toObject()
    },
    async createVerificationToken(data) {
      const em = await getEM()
      const verificationToken = new VerificationTokenModel()
      wrap(verificationToken).assign(data)
      await em.persistAndFlush(verificationToken)

      return wrap(verificationToken).toObject()
    },
    async useVerificationToken(params) {
      const em = await getEM()
      const verificationToken = await em
        .getRepository(VerificationTokenModel)
        .findOne(params)
      if (!verificationToken) return null
      await em.removeAndFlush(verificationToken)

      return wrap(verificationToken).toObject()
    },
  }
}
