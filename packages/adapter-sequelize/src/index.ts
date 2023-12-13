/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://sequelize.org/docs/v6/getting-started/">Sequilize</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://sequelize.org/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/sequelize.svg" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/sequelize-adapter sequelize
 * ```
 *
 * @module @auth/sequelize-adapter
 */
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import { Sequelize, Model, ModelCtor } from "sequelize"
import * as defaultModels from "./models.js"

export { defaultModels as models }

// @see https://sequelize.org/master/manual/typescript.html
//@ts-expect-error
interface AccountInstance
  extends Model<AdapterAccount, Partial<AdapterAccount>>,
    AdapterAccount {}
interface UserInstance
  extends Model<AdapterUser, Partial<AdapterUser>>,
    AdapterUser {}
interface SessionInstance
  extends Model<AdapterSession, Partial<AdapterSession>>,
    AdapterSession {}
interface VerificationTokenInstance
  extends Model<VerificationToken, Partial<VerificationToken>>,
    VerificationToken {}

/** This is the interface of the Sequelize adapter options. */
export interface SequelizeAdapterOptions {
  /**
   * Whether to {@link https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization synchronize} the models or not.
   */
  synchronize?: boolean
  /**
   * The {@link https://sequelize.org/docs/v6/core-concepts/model-basics/ Sequelize Models} related to Auth.js that will be created in your database.
   */
  models?: Partial<{
    User: ModelCtor<UserInstance>
    Account: ModelCtor<AccountInstance>
    Session: ModelCtor<SessionInstance>
    VerificationToken: ModelCtor<VerificationTokenInstance>
  }>
}

/**
 * :::warning
 * You'll also have to manually install [the driver for your database](https://sequelize.org/master/manual/getting-started.html) of choice.
 * :::
 *
 * ## Setup
 *
 * ### Configuring Auth.js
 *
 *  Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import SequelizeAdapter from "@auth/sequelize-adapter"
 * import { Sequelize } from "sequelize"
 *
 * // https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
 * const sequelize = new Sequelize("yourconnectionstring")
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/core#authconfig
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [],
 *   adapter: SequelizeAdapter(sequelize),
 * })
 * ```
 *
 * ### Updating the database schema
 *
 * By default, the sequelize adapter will not create tables in your database. In production, best practice is to create the [required tables](https://authjs.dev/reference/core/adapters/models) in your database via [migrations](https://sequelize.org/master/manual/migrations.html). In development, you are able to call [`sequelize.sync()`](https://sequelize.org/master/manual/model-basics.html#model-synchronization) to have sequelize create the necessary tables, foreign keys and indexes:
 *
 * > This schema is adapted for use in Sequelize and based upon our main [schema](https://authjs.dev/reference/core/adapters#models)
 *
 * ```js
 * import NextAuth from "next-auth"
 * import SequelizeAdapter from "@auth/sequelize-adapter"
 * import Sequelize from 'sequelize'
 *
 * const sequelize = new Sequelize("sqlite::memory:")
 * const adapter = SequelizeAdapter(sequelize)
 *
 * // Calling sync() is not recommended in production
 * sequelize.sync()
 *
 * export default NextAuth({
 *   ...
 *   adapter
 *   ...
 * })
 * ```
 *
 * ## Advanced usage
 *
 * ### Using custom models
 *
 * Sequelize models are option to customization like so:
 *
 * ```js
 * import NextAuth from "next-auth"
 * import SequelizeAdapter, { models } from "@auth/sequelize-adapter"
 * import Sequelize, { DataTypes } from "sequelize"
 *
 * const sequelize = new Sequelize("sqlite::memory:")
 *
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [],
 *   adapter: SequelizeAdapter(sequelize, {
 *     models: {
 *       User: sequelize.define("user", {
 *         ...models.User,
 *         phoneNumber: DataTypes.STRING,
 *       }),
 *     },
 *   }),
 * })
 * ```
 */
export default function SequelizeAdapter(
  client: Sequelize,
  options?: SequelizeAdapterOptions
): Adapter {
  const { models, synchronize = true } = options ?? {}
  const defaultModelOptions = { underscored: true, timestamps: false }
  const { User, Account, Session, VerificationToken } = {
    User:
      models?.User ??
      client.define<UserInstance>(
        "user",
        defaultModels.User,
        defaultModelOptions
      ),
    Account:
      models?.Account ??
      client.define<AccountInstance>(
        "account",
        defaultModels.Account,
        defaultModelOptions
      ),
    Session:
      models?.Session ??
      client.define<SessionInstance>(
        "session",
        defaultModels.Session,
        defaultModelOptions
      ),
    VerificationToken:
      models?.VerificationToken ??
      client.define<VerificationTokenInstance>(
        "verificationToken",
        defaultModels.VerificationToken,
        defaultModelOptions
      ),
  }
  let _synced = false
  const sync = async () => {
    if (process.env.NODE_ENV !== "production" && synchronize && !_synced) {
      const syncOptions =
        typeof synchronize === "object" ? synchronize : undefined

      await Promise.all([
        User.sync(syncOptions),
        Account.sync(syncOptions),
        Session.sync(syncOptions),
        VerificationToken.sync(syncOptions),
      ])

      _synced = true
    }
  }

  Account.belongsTo(User, { onDelete: "cascade" })
  Session.belongsTo(User, { onDelete: "cascade" })

  return {
    async createUser(user) {
      await sync()

      return await User.create(user)
    },
    async getUser(id) {
      await sync()

      const userInstance = await User.findByPk(id)

      return userInstance?.get({ plain: true }) ?? null
    },
    async getUserByEmail(email) {
      await sync()

      const userInstance = await User.findOne({
        where: { email },
      })

      return userInstance?.get({ plain: true }) ?? null
    },
    async getUserByAccount({ provider, providerAccountId }) {
      await sync()

      const accountInstance = await Account.findOne({
        // @ts-expect-error
        where: { provider, providerAccountId },
      })

      if (!accountInstance) {
        return null
      }

      const userInstance = await User.findByPk(accountInstance.userId)

      return userInstance?.get({ plain: true }) ?? null
    },
    async updateUser(user) {
      await sync()

      await User.update(user, { where: { id: user.id } })
      const userInstance = await User.findByPk(user.id)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return userInstance!
    },
    async deleteUser(userId) {
      await sync()

      const userInstance = await User.findByPk(userId)

      await User.destroy({ where: { id: userId } })

      return userInstance
    },
    async linkAccount(account) {
      await sync()

      await Account.create(account)
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await sync()

      await Account.destroy({
        where: { provider, providerAccountId },
      })
    },
    async createSession(session) {
      await sync()

      return await Session.create(session)
    },
    async getSessionAndUser(sessionToken) {
      await sync()

      const sessionInstance = await Session.findOne({
        where: { sessionToken },
      })

      if (!sessionInstance) {
        return null
      }

      const userInstance = await User.findByPk(sessionInstance.userId)

      if (!userInstance) {
        return null
      }

      return {
        session: sessionInstance?.get({ plain: true }),
        user: userInstance?.get({ plain: true }),
      }
    },
    async updateSession({ sessionToken, expires }) {
      await sync()

      await Session.update(
        { expires, sessionToken },
        { where: { sessionToken } }
      )

      return await Session.findOne({ where: { sessionToken } })
    },
    async deleteSession(sessionToken) {
      await sync()

      const session = await Session.findOne({ where: { sessionToken } })
      await Session.destroy({ where: { sessionToken } })
      return session?.get({ plain: true })
    },
    async createVerificationToken(token) {
      await sync()

      return await VerificationToken.create(token)
    },
    async useVerificationToken({ identifier, token }) {
      await sync()

      const tokenInstance = await VerificationToken.findOne({
        where: { identifier, token },
      })

      await VerificationToken.destroy({ where: { identifier } })

      return tokenInstance?.get({ plain: true }) ?? null
    },
  }
}
