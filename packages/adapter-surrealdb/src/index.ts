/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://www.surrealdb.com">SurrealDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.surrealdb.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/surrealdb.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/surrealdb-adapter surrealdb
 * ```
 *
 * @module @auth/surrealdb-adapter
 */
import Surreal, { RecordId } from "surrealdb"
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession as BaseAdapterSession
} from "@auth/core/adapters"
import type { ProviderType } from "@auth/core/providers"

// Extend AdapterSession to include id
interface AdapterSession extends BaseAdapterSession {
  id?: string
}

type Document = Record<string, unknown> & { id: RecordId<string> }

export type UserDoc = Document & { 
  email: string;
  emailVerified?: string | null;
}

export type AccountDoc = Document & {
  userId: RecordId<"user">;
  refresh_token?: string;
  access_token?: string;
  type: Extract<ProviderType, "oauth" | "oidc" | "email" | "webauthn">;
  provider: string;
  providerAccountId: string;
  expires_at?: number;
}

export type SessionDoc = Document & { 
  userId: RecordId<"user">;
  expires?: string;
  sessionToken?: string;
}

export type VerificationTokenDoc = Document & {
  identifier: string;
  token: string;
  expires: string;
}

// Type guards
function isUserDoc(obj: any): obj is UserDoc {
  return obj != null && 
         typeof obj === 'object' && 
         'id' in obj && 
         obj.id instanceof RecordId &&
         'email' in obj
}

function isSessionDoc(obj: any): obj is SessionDoc {
  return obj != null && 
         typeof obj === 'object' && 
         'id' in obj && 
         obj.id instanceof RecordId &&
         'userId' in obj &&
         obj.userId instanceof RecordId
}

/** @internal */
// Convert DB object to AdapterUser
export const docToUser = (doc: UserDoc): AdapterUser => ({
  ...doc,
  id: doc.id.id.toString(),
  emailVerified: doc.emailVerified ? new Date(doc.emailVerified) : null,
})

/** @internal */
// Convert DB object to AdapterAccount
export const docToAccount = (doc: AccountDoc): AdapterAccount => {
  const account: AdapterAccount = {
    ...doc,
    id: doc.id.id.toString(),
    userId: doc.userId.id.toString(),
  }
  return account
}

/** @internal */
// Convert DB object to AdapterSession
export const docToSession = (doc: SessionDoc): AdapterSession => ({
  id: doc.id.id.toString(),
  userId: doc.userId.id.toString(),
  expires: new Date(doc.expires ?? ""),
  sessionToken: doc.sessionToken ?? "",
})

/** @internal */
// Convert AdapterUser to DB object
const userToDoc = (user: Omit<AdapterUser, "id">): Record<string, unknown> => ({
  ...user,
  emailVerified: user.emailVerified?.toISOString(),
})

/** @internal */
// Convert AdapterAccount to DB object
const accountToDoc = (account: AdapterAccount): Record<string, unknown> => ({
  ...account,
  userId: new RecordId("user", account.userId),
})

/** @internal */
// Convert AdapterSession to DB object
export const sessionToDoc = (session: AdapterSession): Record<string, unknown> => {
  const { id: _, ...rest } = session
  const doc: Record<string, unknown> = {
    ...rest,
    userId: new RecordId("user", session.userId),
    expires: session.expires.toISOString(),
  }
  
  if (session.id) {
    doc.id = new RecordId("session", session.id)
  }
  
  return doc
}

export function SurrealDBAdapter(client: Promise<Surreal>): Adapter {
  return {
    async createUser(user) {
      const surreal = await client
      const doc = userToDoc(user)
      const [userDoc] = await surreal.create("user", doc) as [unknown]
      if (userDoc && isUserDoc(userDoc)) {
        return docToUser(userDoc)
      }
      throw new Error("User not created")
    },

    async getUser(id) {
      const surreal = await client
      try {
        const rid = new RecordId("user", id)
        const queryResult = await surreal.query<[unknown[]]>(
          "SELECT * FROM $user",
          { user: rid }
        )
        const doc = queryResult[0]?.[0]
        if (doc && isUserDoc(doc)) {
          return docToUser(doc)
        }
      } catch (error) {
        console.error("Error in getUser:", error)
      }
      return null
    },

    async getUserByEmail(email) {
      const surreal = await client
      try {
        const users = await surreal.query<[UserDoc[]]>(
          `SELECT * FROM user WHERE email = $email LIMIT 1`,
          { email }
        )
        const doc = users[0]?.[0]
        if (doc) return docToUser(doc)
      } catch (error) {
        console.error("Error in getUserByEmail:", error)
      }
      return null
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const surreal = await client
      try {
        const users = await surreal.query<[{ userId: UserDoc }[]]>(
          `SELECT userId
           FROM account
           WHERE providerAccountId = $providerAccountId
           AND provider = $provider
           FETCH userId
           LIMIT 1`,
          { providerAccountId, provider }
        )
        const user = users[0]?.[0]?.userId
        if (user) return docToUser(user)
      } catch (error) {
        console.error("Error in getUserByAccount:", error)
      }
      return null
    },

    async updateUser(user) {
      if (!user.id) throw new Error("User id is required")
      const surreal = await client
      const doc = {
        ...user,
        emailVerified: user.emailVerified?.toISOString(),
        id: undefined,
      }
      const rid = new RecordId("user", user.id)
      const updatedUser = await surreal.merge<UserDoc>(rid, doc)
      if (updatedUser.length && isUserDoc(updatedUser[0])) {
        return docToUser(updatedUser[0])
      }
      throw new Error("User not updated")
    },

    async deleteUser(userId) {
      const surreal = await client
      const rid = new RecordId("user", userId)

      // Delete associated records in parallel
      await Promise.all([
        // Delete accounts
        surreal.query<[AccountDoc[]]>(
          `SELECT * FROM account WHERE userId = $userId`,
          { userId: rid }
        ).then(accounts => {
          const accountsToDelete = accounts[0] || []
          return Promise.all(
            accountsToDelete.map(account => surreal.delete(account.id))
          )
        }).catch(console.error),

        // Delete sessions
        surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session WHERE userId = $userId`,
          { userId: rid }
        ).then(sessions => {
          const sessionsToDelete = sessions[0] || []
          return Promise.all(
            sessionsToDelete.map(session => surreal.delete(session.id))
          )
        }).catch(console.error),

        // Delete user
        surreal.delete(rid)
      ])
    },

    async linkAccount(account) {
      const surreal = await client
      const doc = accountToDoc(account)
      const [linkedAccount] = await surreal.create("account", doc) as [AccountDoc]
      if (linkedAccount) {
        return docToAccount(linkedAccount)
      }
      throw new Error("Account not linked")
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const surreal = await client
      try {
        const accounts = await surreal.query<[AccountDoc[]]>(
          `SELECT * FROM account
           WHERE providerAccountId = $providerAccountId
           AND provider = $provider
           LIMIT 1`,
          { providerAccountId, provider }
        )
        const account = accounts[0]?.[0]
        if (account) {
          await surreal.delete(account.id)
        }
      } catch (error) {
        console.error("Error in unlinkAccount:", error)
      }
    },

    async createSession({ sessionToken, userId, expires }): Promise<AdapterSession> {
      const surreal = await client
      const doc = sessionToDoc({
        sessionToken,
        userId,
        expires,
      } as AdapterSession)
      const [session] = await surreal.create("session", doc) as [SessionDoc]
      if (!session) {
        throw new Error("Session not created")
      }
      return docToSession(session)
    },

    async getSessionAndUser(sessionToken) {
      const surreal = await client
      try {
        const sessions = await surreal.query<[{ session: unknown; userId: unknown }[]]>(
          `SELECT *, userId FROM session
           WHERE sessionToken = $sessionToken
           AND expires > time::now()
           FETCH userId
           LIMIT 1`,
          { sessionToken }
        )
        const result = sessions[0]?.[0]
        
        if (result?.userId && result.session && 
            isUserDoc(result.userId) && isSessionDoc(result.session)) {
          return {
            user: docToUser(result.userId),
            session: docToSession(result.session),
          }
        }
      } catch (error) {
        console.error("Error in getSessionAndUser:", error)
      }
      return null
    },

    async updateSession(session) {
      const surreal = await client
      try {
        const sessions = await surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session
           WHERE sessionToken = $sessionToken
           LIMIT 1`,
          { sessionToken: session.sessionToken }
        )
        const sessionDoc = sessions[0]?.[0]
        if (sessionDoc && session.expires) {
          // First create an adapter-compatible object
          const adapterSession: AdapterSession = {
            ...session,
            userId: sessionDoc.userId.id.toString(),
            expires: session.expires,
          }
          
          // Then convert to DB format
          const dbDoc = sessionToDoc(adapterSession)
          
          const updatedSession = await surreal.merge<SessionDoc>(
            sessionDoc.id,
            dbDoc
          )
          
          if (updatedSession.length && isSessionDoc(updatedSession[0])) {
            return docToSession(updatedSession[0])
          }
        }
      } catch (error) {
        console.error("Error in updateSession:", error)
      }
      return null
    },

    async deleteSession(sessionToken) {
      const surreal = await client
      try {
        const sessions = await surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session
           WHERE sessionToken = $sessionToken
           LIMIT 1`,
          { sessionToken }
        )
        const session = sessions[0]?.[0]
        if (session) {
          await surreal.delete(session.id)
        }
      } catch (error) {
        console.error("Error in deleteSession:", error)
      }
    },

    async createVerificationToken(params) {
      const surreal = await client
      const doc = {
        identifier: params.identifier,
        expires: params.expires.toISOString(),
        token: params.token,
      }
      const [token] = await surreal.create("verification_token", doc) as [VerificationTokenDoc]
      if (token) {
        return {
          identifier: token.identifier,
          expires: new Date(token.expires),
          token: token.token,
        }
      }
      return null
    },

    async useVerificationToken({ identifier, token }) {
      const surreal = await client
      try {
        const tokens = await surreal.query<[VerificationTokenDoc[]]>(
          `SELECT * FROM verification_token
           WHERE identifier = $identifier
           AND token = $verificationToken
           AND expires > time::now()
           LIMIT 1`,
          { identifier, verificationToken: token }
        )
        const vt = tokens[0]?.[0]
        if (vt) {
          await surreal.delete(vt.id)
          return {
            identifier: vt.identifier,
            expires: new Date(vt.expires),
            token: vt.token,
          }
        }
      } catch (error) {
        console.error("Error in useVerificationToken:", error)
      }
      return null
    },
  }
}
