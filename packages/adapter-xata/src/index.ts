import { Adapter } from "next-auth/src/adapters"

const XataAdapter = (client: any, options?: any): Adapter => {
  return {
    async createUser(user) {
      return await client.db.nextauth_users.create(user);
    },
    async getUser(id) {
      return await client.db.nextauth_users.filter({ id }).getFirst()
    },
    async getUserByEmail(email) {
      return await client.db.nextauth_users.filter({ email }).getFirst()
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await client.db.nextauth_users_accounts.select(['user.*']).filter({ 'account.providerAccountId': providerAccountId, 'account.provider': provider }).getFirst();
      return result.user;
    },
    async updateUser(user) {
      return await client.db.nextauth_users.update(user);
    },
    async deleteUser(id) {
      return await client.db.nextauth_users.delete(id)
    },
    async linkAccount(initialAccount) {
      const { userId, ...account } = initialAccount
      const newXataAccount = await client.db.nextauth_accounts.create({ ...account, user: { id: userId } })
      return await client.db.nextauth_users_accounts.create({ user: { id: userId }, account: { id: newXataAccount.id } })
    },
    async unlinkAccount({ providerAccountId, provider }) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const connectedAccount = await client.db.nextauth_users_accounts.filter({ 'account.providerAccountId': providerAccountId, 'account.provider': provider }).getFirst();
      return await client.db.nextauth_users_accounts.delete(connectedAccount.id)
    },
    async createSession(initialSession) {
      const { userId, ...session } = initialSession
      const newXataSession = await client.db.nextauth_sessions.create({ ...session, user: { id: userId } });
      await client.db.nextauth_users_sessions.create({ user: { id: userId }, session: { id: newXataSession.id } })
      return newXataSession;
    },
    async getSessionAndUser(sessionToken) {
      return await client.db.nextauth_users_sessions.select(['user.*', 'session.*']).filter({ 'session.sessionToken': sessionToken }).getFirst()
    },
    async updateSession({ sessionToken, ...data }) {
      const session = await client.db.nextauth_sessions.filter({ sessionToken }).getFirst();
      return await client.db.nextauth_sessions.update({ ...session, ...data })
    },
    async deleteSession(sessionToken) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const session = await client.db.nextauth_sessions.filter({ sessionToken }).getFirst();
      const connectedSession = await client.db.nextauth_users_sessions.filter({ 'session.sessionToken': sessionToken }).getFirst();
      await client.db.nextauth_sessions.delete(session.id)
      return await client.db.nextauth_users_sessions.delete(connectedSession.id)
    },
    async createVerificationToken(token) {
      return await client.db.nextauth_verificationTokens.create(token)
    },
    async useVerificationToken(token) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const xataToken = await client.db.nextauth_verificationTokens.filter({ token }).getFirst();
      return await client.db.nextauth_verificationTokens.delete(xataToken.id)
    },
  }
}

export default XataAdapter;