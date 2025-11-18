/**
 * This is a simple in-memory adapter for NextAuth.js that is intended for use in tests only.
 * Original source: https://github.com/nextauthjs/next-auth/pull/8809
 */
import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "../adapters.js"

/**
 * Represents the in-memory data structure for the adapter.
 */
export type Memory = {
  users: Map<string, AdapterUser>
  accounts: Map<string, AdapterAccount>
  sessions: Map<string, AdapterSession>
  verificationTokens: Map<string, VerificationToken>
}

/**
 * Initializes a new instance of the Memory object.
 * @returns A Memory object with empty maps for users, accounts, sessions, etc.
 */
export function initMemory(): Memory {
  return {
    users: new Map<string, AdapterUser>(),
    accounts: new Map<string, AdapterAccount>(),
    sessions: new Map<string, AdapterSession>(),
    verificationTokens: new Map<string, VerificationToken>(),
  }
}

export function MemoryAdapter(
  memory?: Memory,
  newSessionToken: string | null = null
): Adapter {
  const { users, accounts, sessions, verificationTokens } =
    memory ?? initMemory()

  // Create the adapter object first and then populate it.
  // This allows us to call adapter functions from within.
  const adapter: Adapter = {}

  // Assign all functions in place
  Object.assign(adapter, {
    async createUser(user: AdapterUser) {
      const newUser = { ...user, id: makeid(32) }
      users.set(newUser.id, newUser)

      return newUser
    },
    async getUser(id: string) {
      return users.get(id) ?? null
    },
    async getUserByEmail(email: string) {
      return (
        Array.from(users.values()).find((user) => user.email === email) ?? null
      )
    },
    async getUserByAccount(
      providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      const account = accounts.get(providerAccountId.providerAccountId)
      if (!account) return null

      return users.get(account.userId) ?? null
    },
    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const currentUser = users.get(user.id)
      if (!currentUser) throw new Error("User not found")

      const updatedUser = { ...currentUser, ...user }
      users.set(user.id, updatedUser)

      return updatedUser
    },
    async deleteUser(id: string) {
      const user = users.get(id)
      if (!user) return

      // Delete sessions
      if (!adapter.deleteSession)
        throw new Error("Adapter does not implement deleteSession!")
      const { deleteSession } = adapter
      sessions.forEach(async (session) => {
        if (session.userId === user.id) {
          await deleteSession(session.sessionToken)
        }
      })

      // Delete accounts
      if (!adapter.unlinkAccount)
        throw new Error("Adapter does not implement unlinkAccount!")
      const { unlinkAccount } = adapter
      accounts.forEach(async (account) => {
        if (account.userId === user.id) {
          await unlinkAccount(account)
        }
      })

      // Delete verification tokens
      if (!adapter.useVerificationToken)
        throw new Error("Adapter does not implement useVerificationToken!")
      const { useVerificationToken } = adapter
      verificationTokens.forEach(async (verificationToken) => {
        if (verificationToken.identifier === user.email) {
          await useVerificationToken(verificationToken)
        }
      })

      // Delete user
      users.delete(id)

      return
    },
    async linkAccount(account: AdapterAccount) {
      accounts.set(account.providerAccountId, account)

      return account
    },
    async unlinkAccount(
      account: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      // Find account
      const currentAccount = accounts.get(account.providerAccountId)
      if (!currentAccount) return

      // Delete account
      accounts.delete(currentAccount.providerAccountId)

      return
    },
    async listLinkedAccounts(userId: string) {
      return Array.from(accounts.values()).filter(
        (account) => account.userId === userId
      )
    },
    async createSession(session: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      sessions.set(session.sessionToken, session)

      return session
    },
    async getSessionAndUser(sessionToken: string) {
      const session = sessions.get(sessionToken)
      if (!session) return null

      // Remove if expired
      if (session.expires < new Date()) {
        if (!adapter.deleteSession)
          throw new Error("Adapter does not implement deleteSession!")
        await adapter.deleteSession(sessionToken)

        return null
      }

      const user = users.get(session.userId)
      if (!user) return null

      return { session, user }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      const currentSession = sessions.get(session.sessionToken)
      if (!currentSession) throw new Error("Session not found")

      const updatedSession = { ...currentSession, ...session }
      if (newSessionToken) {
        // Delete old session token if a new one is provided
        sessions.delete(session.sessionToken)
        // Create a new session with the new session token
        updatedSession.sessionToken = newSessionToken
        sessions.set(newSessionToken, updatedSession)

        return updatedSession
      }

      sessions.set(session.sessionToken, updatedSession)

      return updatedSession
    },
    async deleteSession(sessionToken: string) {
      sessions.delete(sessionToken)

      return
    },
    async createVerificationToken(verificationToken: VerificationToken) {
      verificationTokens.set(verificationToken.token, verificationToken)

      return verificationToken
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      const { token } = params

      // Find verification token
      const verificationToken = verificationTokens.get(token)
      if (!verificationToken) return null

      // Delete used verification token
      verificationTokens.delete(token)

      return verificationToken
    },
  } as Adapter)

  return adapter
}

/**
 * Generates a random string of the specified length.
 * @param length The length of the generated string.
 * @returns The randomly generated string.
 */
function makeid(length: number) {
  let result = ""
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  // Build a string of the specified length by randomly selecting
  // characters from the alphabet at each iteration.
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length)
    result += alphabet.charAt(randomIndex)
  }

  return result
}

export function asBase64(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64")
}
