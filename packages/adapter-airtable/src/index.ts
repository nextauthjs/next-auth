import { Adapter } from "next-auth/adapters"
import AirtableModel, { AirtableAdapterOptions } from "./airtable"

export function AirtableAdapter(options: AirtableAdapterOptions): Adapter {
  const {
    account: Account,
    user: User,
    session: Session,
    verification: Verification,
  } = AirtableModel(options)

  return {
    async createUser(user: any) {
      return User.createUser(user)
    },

    async getUser(id) {
      return User.getUserById(id)
    },

    async getUserByEmail(email) {
      return User.getUserByEmail(email)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const user = await Account.getAccountByProvider({
        providerAccountId,
        provider,
      })
      const { userId } = user || {}
      if (!userId) return null
      return User.getUserById(userId.toString())
    },

    async updateUser(user) {
      const u = await User.updateUser(user)
      if (!u) return null
      return User.getUserById(u.id.toString())
    },

    async deleteUser(userId) {
      return User.deleteUser(userId)
    },

    async linkAccount(account) {
      await Account.createAccount(account)
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const account = await Account.getAccountByProvider({
        providerAccountId,
        provider,
      })
      const { id } = account || {}
      if (!id) return
      await Account.deleteAccount(id)
    },

    async createSession(session) {
      return Session.createSession(session)
    },

    async getSessionAndUser(sessionToken) {
      const session = await Session.getSessionBySessionToken(sessionToken)
      if (!session) return null
      const user = await User.getUserById(session.userId)
      if (!user) return null
      return {
        session,
        user,
      }
    },

    async updateSession(newSession) {
      const session = await Session.updateSession(newSession)
      return session ? Session.getSession(session.id) : null
    },

    async deleteSession(sessionToken) {
      const sessionId = (await Session.getSessionBySessionToken(sessionToken))
        ?.id
      if (!sessionId) return null
      await Session.deleteSession(sessionId)
    },

    async createVerificationToken(data) {
      const verifier = await Verification.createVerification(data)
      if (!verifier) return null
      const { expires, identifier, token } = verifier
      return {
        token,
        identifier,
        expires,
      }
    },

    async useVerificationToken({ identifier, token }) {
      const verifier =
        await Verification.getVerificationTokenByIdentifierAndToken({
          identifier,
          token,
        })
      if (!verifier?.id) return null
      await Verification.deleteVerification(verifier.id)
      return {
        token: verifier.token,
        identifier: verifier.identifier,
        expires: verifier.expires,
      }
    },
  }
}
