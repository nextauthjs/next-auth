import type Surreal from "surrealdb.js"
import type { Result } from "surrealdb.js"
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters"
import type { ProviderType } from "next-auth/providers"

type Document = Record<string, string | null | undefined> & { id: string }
export type UserDoc = Document & { email: string }
export type AccountDoc<T = string> = {
  id: string
  userId: T
  refresh_token?: string
  access_token?: string
  type: ProviderType
  provider: string
  providerAccountId: string
  expires_at?: number
}
export type SessionDoc<T = string> = Document & { userId: T }

const extractId = (surrealId: string) => surrealId.split(":")[1] ?? surrealId

// Convert DB object to AdapterUser
export const docToUser = (doc: UserDoc): AdapterUser => ({
  ...doc,
  id: extractId(doc.id),
  emailVerified: doc.emailVerified ? new Date(doc.emailVerified) : null,
})

// Convert DB object to AdapterAccount
export const docToAccount = (doc: AccountDoc): AdapterAccount => {
  const account = {
    ...doc,
    id: extractId(doc.id),
    userId: doc.userId ? extractId(doc.userId) : "",
  }
  return account
}

// Convert DB object to AdapterSession
export const docToSession = (
  doc: SessionDoc<string | UserDoc>
): AdapterSession => ({
  userId: extractId(
    typeof doc.userId === "string" ? doc.userId : doc.userId.id
  ),
  expires: new Date(doc.expires ?? ""),
  sessionToken: doc.sessionToken ?? "",
})

// Convert AdapterUser to DB object
const userToDoc = (
  user: Omit<AdapterUser, "id"> | Partial<AdapterUser>
): Omit<UserDoc, "id"> => {
  const doc = {
    ...user,
    emailVerified: user.emailVerified?.toISOString(),
  }
  return doc
}

// Convert AdapterAccount to DB object
const accountToDoc = (account: AdapterAccount): Omit<AccountDoc, "id"> => {
  const doc = {
    ...account,
    userId: `user:${account.userId}`,
  }
  return doc
}

// Convert AdapterSession to DB object
export const sessionToDoc = (
  session: AdapterSession
): Omit<SessionDoc, "id"> => {
  const doc = {
    ...session,
    expires: session.expires.toISOString(),
  }
  return doc
}

export function SurrealDBAdapter(
  client: Promise<Surreal>
  // options = {}
): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const surreal = await client
      const doc = userToDoc(user)
      const userDoc = (await surreal.create("user", doc)) as UserDoc
      return docToUser(userDoc)
    },
    async getUser(id: string) {
      const surreal = await client
      try {
        const usersResultArr = await surreal.query<Result<UserDoc[]>[]>(
          "SELECT * FROM $user",
          {
            user: `user:${id}`,
          }
        )
        const users = usersResultArr[0]?.result
        if (users) {
          return docToUser(users[0])
        }
      } catch (e) {}
      return null
    },
    async getUserByEmail(email: string) {
      const surreal = await client
      try {
        const users = await surreal.query<Result<UserDoc[]>[]>(
          `SELECT * FROM user WHERE email = $email`,
          { email }
        )
        const user = users[0].result?.[0]
        if (user) return docToUser(user)
      } catch (e) {}
      return null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client
      try {
        const users = await surreal.query<Result<AccountDoc<UserDoc>[]>[]>(
          `SELECT userId
           FROM account
           WHERE providerAccountId = $providerAccountId
           AND provider = $provider
           FETCH userId`,
          { providerAccountId, provider }
        )
        const user = users[0].result?.[0]?.userId
        if (user) return docToUser(user)
      } catch (e) {}
      return null
    },
    async updateUser(user: Partial<AdapterUser>) {
      const surreal = await client
      const doc = userToDoc(user)
      let updatedUser = await surreal.change<Omit<UserDoc, "id">>(
        `user:${user.id}`,
        doc
      )
      if (Array.isArray(updatedUser)) {
        updatedUser = updatedUser[0]
      }
      return docToUser(updatedUser as UserDoc)
    },
    async deleteUser(userId: string) {
      const surreal = await client

      // delete account
      try {
        const accounts = await surreal.query<Result<AccountDoc[]>[]>(
          `SELECT *
          FROM account
          WHERE userId = $userId
          LIMIT 1`,
          { userId: `user:${userId}` }
        )
        const account = accounts[0].result?.[0]
        if (account) {
          const accountId = extractId(account.id)
          await surreal.delete(`account:${accountId}`)
        }
      } catch (e) {}

      // delete session
      try {
        const sessions = await surreal.query<Result<SessionDoc[]>[]>(
          `SELECT *
          FROM session
          WHERE userId = $userId
          LIMIT 1`,
          { userId: `user:${userId}` }
        )
        const session = sessions[0].result?.[0]
        if (session) {
          const sessionId = extractId(session.id)
          await surreal.delete(`session:${sessionId}`)
        }
      } catch (e) {}

      // delete user
      await surreal.delete(`user:${userId}`)

      // TODO: put all 3 deletes inside a Promise all
    },
    async linkAccount(account: AdapterAccount) {
      const surreal = await client
      const doc = (await surreal.create(
        "account",
        accountToDoc(account)
      )) as AccountDoc
      return docToAccount(doc)
    },
    async unlinkAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client
      try {
        const accounts = await surreal.query<Result<AccountDoc[]>[]>(
          `SELECT *
          FROM account
          WHERE providerAccountId = $providerAccountId
            AND provider = $provider
          LIMIT 1`,
          { providerAccountId, provider }
        )
        const account = accounts[0].result?.[0]
        if (account) {
          const accountId = extractId(account.id)
          await surreal.delete(`account:${accountId}`)
        }
      } catch (e) {}
    },
    async createSession({
      sessionToken,
      userId,
      expires,
    }: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      const surreal = await client
      const doc = {
        sessionToken,
        userId: `user:${userId}`,
        expires,
      }
      await surreal.create("session", doc)
      return doc
    },
    async getSessionAndUser(sessionToken: string) {
      const surreal = await client
      try {
        // Can't use limit 1 because it prevent userId to be fetched.
        //   Works setting limit to 2
        const sessions = await surreal.query<Result<SessionDoc<UserDoc>[]>[]>(
          `SELECT *
           FROM session
           WHERE sessionToken = $sessionToken
           FETCH userId`,
          { sessionToken }
        )
        const session = sessions[0].result?.[0]
        if (session) {
          const userDoc = session.userId
          if (!userDoc) return null
          return {
            user: docToUser(userDoc),
            session: docToSession({
              ...session,
              userId: userDoc.id,
            }),
          }
        }
        return null
      } catch (e) {
        return null
      }
    },
    async updateSession(
      session: Partial<AdapterSession> &
        Pick<AdapterSession, "sessionToken">
    ) {
      const surreal = await client
      try {
        const sessions = await surreal.query<Result<SessionDoc[]>[]>(
          `SELECT *
          FROM session
          WHERE sessionToken = $sessionToken
          LIMIT 1`,
          { sessionToken: session.sessionToken }
        )
        const sessionDoc = sessions[0].result?.[0]
        if (sessionDoc && session.expires) {
          const sessionId = extractId(sessionDoc.id)
          let updatedSession = await surreal.change<Omit<SessionDoc, "id">>(
            `session:${sessionId}`,
            sessionToDoc({
              ...sessionDoc,
              ...session,
              userId: sessionDoc.userId,
              expires: session.expires,
            })
          )
          if (Array.isArray(updatedSession)) {
            updatedSession = updatedSession[0]
          }
          return docToSession(updatedSession as SessionDoc)
        }
      } catch (e) {}
      return null
    },
    async deleteSession(sessionToken: string) {
      const surreal = await client
      try {
        const sessions = await surreal.query<Result<SessionDoc[]>[]>(
          `SELECT *
           FROM session
           WHERE sessionToken = $sessionToken
           LIMIT 1`,
          { sessionToken }
        )
        const session = sessions[0].result?.[0]
        if (session) {
          const sessionId = extractId(session.id)
          await surreal.delete(`session:${sessionId}`)
        }
      } catch (e) {}
    },
    async createVerificationToken({
      identifier,
      expires,
      token,
    }: VerificationToken) {
      const surreal = await client
      const doc = {
        identifier,
        expires,
        token,
      }
      await surreal.create("verification_token", doc)
      return doc
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }) {
      const surreal = await client
      try {
        const tokens = await surreal.query<
          Result<(VerificationToken & { id: string })[]>[]
        >(
          `SELECT *
           FROM verification_token
           WHERE identifier = $identifier
             AND token = $token
           LIMIT 1`,
          { identifier, token }
        )
        const vt = tokens[0].result?.[0]
        if (vt) {
          await surreal.delete(vt.id)
          return {
            identifier: vt.identifier,
            expires: new Date(vt.expires),
            token: vt.token,
          }
        }
        return null
      } catch (e) {
        return null
      }
    },
  }
}
