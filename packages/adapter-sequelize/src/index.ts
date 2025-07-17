/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://sequelize.org/docs/v6/getting-started/">Sequilize</a> adapter for Auth.js / NextAuth.js.</p>
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
  }>;
  /**
   * Override the default model {@link https://sequelize.org/docs/v6/core-concepts/assocs/ associations}
   *
   * Default Associations:
   * ```ts
   * Account.belongsTo(User, { onDelete: "cascade" })
   * Session.belongsTo(User, { onDelete: "cascade" })
   * ```
   *
   * Example:
   * ```ts
   * (User, Account, Session) => {
   *   Account.belongsTo(User, { onDelete: "cascade", foreignKey: "userId", as: 'user' });
   *   Session.belongsTo(User, { onDelete: "cascade", foreignKey: "userId", as: 'user' });
   * }
   * ```
   */
  associations?: (
    User: ModelCtor<UserInstance>,
    Account: ModelCtor<AccountInstance>,
    Session: ModelCtor<SessionInstance>,
    VerificationToken: ModelCtor<VerificationTokenInstance>
  ) => void;
}

export default function SequelizeAdapter(
  client: Sequelize,
  options?: SequelizeAdapterOptions
): Adapter {
  const { models, synchronize = true, associations } = options ?? {}
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

  if (associations) {
    associations(User, Account, Session, VerificationToken);
  } else {
    Account.belongsTo(User, { onDelete: 'cascade' });
    Session.belongsTo(User, { onDelete: 'cascade' });
  }

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
