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
 * npm install @auth/surrealdb-adapter surrealdb.js
 * ```
 *
 * @module @auth/surrealdb-adapter
 */
import { Surreal, RecordId } from "surrealdb"
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterAccountType,
  AdapterAuthenticator,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"

type Document<T = RecordId<string>> = {
  id: T
  [key: string]: unknown
}
export type UserDoc = Document<RecordId<"user">> & {
  email: string
  emailVerified?: string | Date
}
export type AccountDoc<T = RecordId<"user">> = Document<RecordId<"account">> & {
  userId: T
  refresh_token?: string
  access_token?: string
  type: AdapterAccountType
  provider: string
  providerAccountId: string
  expires_at?: number
}
export type SessionDoc<T = RecordId<"user">> = Document<RecordId<"session">> & {
  userId: T
  expires: string | Date
  sessionToken: string
}
export type VerificationTokenDoc = Document<RecordId<"verification_token">> & {
  identifier: string
  expires: Date
  token: string
}
export type AuthenticatorDoc<T = RecordId<"user">> = Document<
  RecordId<"authenticator">
> &
  Omit<AdapterAuthenticator, "userId"> & {
    userId: T
    counter: number
  }

/** @internal */
// Convert DB object to AdapterUser
export const docToUser = (doc: UserDoc): AdapterUser => ({
  ...doc,
  id: doc.id.id.toString(),
  emailVerified:
    typeof doc?.emailVerified === "string"
      ? new Date(Date.parse(doc.emailVerified))
      : (doc?.emailVerified ?? null),
})

/** @internal */
// Convert DB object to AdapterAccount
export const docToAccount = (doc: AccountDoc): AdapterAccount => ({
  ...doc,
  id: doc.id.id.toString(),
  userId: doc.userId.id.toString(),
})

/** @internal */
// Convert DB object to AdapterAccount
export const docToAuthenticator = (
  doc: AuthenticatorDoc
): AdapterAuthenticator => ({
  ...doc,
  userId: doc.userId.id.toString(),
})

/** @internal */
// Convert DB object to AdapterSession
export const docToSession = (
  doc: SessionDoc<RecordId<string> | UserDoc>
): AdapterSession => ({
  userId:
    doc.userId instanceof RecordId
      ? doc.userId.id.toString()
      : doc.userId.id.id.toString(),
  expires:
    typeof doc?.expires === "string"
      ? new Date(Date.parse(doc.expires))
      : (doc?.expires ?? null),
  sessionToken: doc.sessionToken,
})

/** @internal */
// Convert DB object to Verification Token
export const docToVerificationToken = (
  doc: VerificationTokenDoc
): VerificationToken => ({
  identifier: doc.identifier,
  expires: doc.expires,
  token: doc.token,
})

/** @internal */
// Convert AdapterUser to DB object
const userToDoc = (user: Partial<AdapterUser>): Partial<UserDoc> => ({
  ...user,
  id: user?.id ? new RecordId("user", user.id) : undefined,
  emailVerified: user.emailVerified ?? undefined,
})

/** @internal */
// Convert AdapterAccount to DB object
const accountToDoc = (account: AdapterAccount): Omit<AccountDoc, "id"> => ({
  ...account,
  userId: new RecordId("user", account.userId.replace("user:", "")),
})

/** @internal */
// Convert AdapterAuthenticator to DB object
const authenticatorToDoc = (
  authenticator: AdapterAuthenticator
): Partial<AuthenticatorDoc> => ({
  ...authenticator,
  userId: new RecordId("user", authenticator.userId.replace("user:", "")),
})

/** @internal */
// Convert AdapterSession to DB object
export const sessionToDoc = (
  session: AdapterSession
): Partial<SessionDoc<RecordId<string>>> => ({
  ...session,
  userId: new RecordId("user", session.userId.replace("user:", "")),
  expires: session.expires,
})

/** @internal */
// Convert VerificationToken to DB object
const verificationTokenToDoc = (
  account: VerificationToken
): Omit<VerificationTokenDoc, "id"> => ({
  ...account,
})

/** @internal */
/**
 * Removes all undefined fields in an object
 * @param obj
 * @returns
 */
function removeUndefinedFields<T>(obj: T): Partial<T | null> {
  if (typeof obj !== "object" || obj === null) {
    return obj
  }
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key]
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      removeUndefinedFields(obj[key])
    }
  }
  return obj
}

export function SurrealDBAdapter(
  client: Promise<Surreal>
  // options = {}
): Adapter {
  return {
    async createUser(user: Partial<AdapterUser>) {
      try {
        const surreal = await client
        const doc = userToDoc(user)
        const userDoc = await surreal.create<UserDoc, Omit<UserDoc, "id">>(
          "user",
          doc
        )
        if (userDoc.length) {
          return docToUser(userDoc[0])
        }
      } catch {}
      throw new Error("User not created")
    },
    async getUser(id: string) {
      const surreal = await client
      try {
        const [userDoc] = await surreal.query<[UserDoc[]]>(
          "SELECT * FROM $user",
          {
            user: new RecordId("user", id),
          }
        )
        const doc = userDoc.at(0)
        if (doc) {
          return docToUser(doc)
        }
      } catch {}
      return null
    },
    async getUserByEmail(email: string) {
      const surreal = await client
      try {
        const [users] = await surreal.query<[UserDoc[]]>(
          `SELECT * FROM user WHERE email = $email`,
          { email }
        )
        const doc = users.at(0)
        if (doc) return docToUser(doc)
      } catch {}
      return null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client
      try {
        const [accounts] = await surreal.query<[AccountDoc<UserDoc>[]]>(
          `SELECT userId FROM account WHERE providerAccountId = $providerAccountId AND provider = $provider FETCH userId`,
          {
            providerAccountId,
            provider,
          }
        )
        const user = accounts.at(0)?.userId
        if (user) return docToUser(user)
      } catch {}
      return null
    },
    async updateUser(user: Partial<AdapterUser>) {
      try {
        if (!user.id) throw new Error("User id is required")
        const surreal = await client
        const doc: Partial<UserDoc> | null = removeUndefinedFields(
          userToDoc({
            ...user,
            id: undefined,
          })
        )
        if (doc) {
          const updatedUser = await surreal.merge<UserDoc, Partial<UserDoc>>(
            new RecordId("user", user.id),
            doc
          )
          if (updatedUser) {
            return docToUser(updatedUser)
          }
        }
      } catch {}
      throw new Error("User not updated")
    },
    async deleteUser(userId: string) {
      const surreal = await client

      // delete account
      try {
        const [accounts] = await surreal.query<[AccountDoc[]]>(
          `SELECT * FROM account WHERE userId = $userId LIMIT 1`,
          { userId: new RecordId("user", userId) }
        )
        const account = accounts.at(0)
        if (account) {
          await surreal.delete(account.id)
        }
      } catch {}

      // delete session
      try {
        const [sessions] = await surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session WHERE userId = $userId LIMIT 1`,
          { userId: new RecordId("user", userId) }
        )
        const session = sessions.at(0)
        if (session) {
          await surreal.delete(session.id)
        }
      } catch {}

      // delete user
      await surreal.delete(new RecordId("user", userId))

      // TODO: put all 3 deletes inside a Promise all
    },
    async linkAccount(account: AdapterAccount) {
      try {
        const surreal = await client
        const accountDoc = await surreal.create<
          AccountDoc,
          Omit<AccountDoc, "id">
        >("account", accountToDoc(account))
        if (accountDoc.length) {
          return docToAccount(accountDoc[0])
        }
      } catch {}
      throw new Error("Account not created")
    },
    async unlinkAccount({
      providerAccountId,
      provider,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const surreal = await client
      try {
        const [accounts] = await surreal.query<[AccountDoc[]]>(
          `SELECT * FROM account WHERE providerAccountId = $providerAccountId AND provider = $provider LIMIT 1`,
          { providerAccountId, provider }
        )
        const account = accounts.at(0)
        if (account) {
          await surreal.delete(account.id)
        }
      } catch {}
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
      const doc = sessionToDoc({
        sessionToken,
        userId,
        expires,
      })
      const result = await surreal.create<SessionDoc, Omit<SessionDoc, "id">>(
        "session",
        doc
      )
      return docToSession(result[0]) ?? null
    },
    async getSessionAndUser(sessionToken: string) {
      const surreal = await client
      try {
        // Can't use limit 1 because it prevents userId from being fetched.
        //   Works setting limit to 2
        const [sessions] = await surreal.query<[SessionDoc<UserDoc>[]]>(
          `SELECT * FROM session WHERE sessionToken = $sessionToken FETCH userId`,
          { sessionToken }
        )
        const session = sessions.at(0)
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
      } catch {}
      return null
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      const surreal = await client
      try {
        const [sessions] = await surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session WHERE sessionToken = $sessionToken LIMIT 1`,
          {
            sessionToken: session.sessionToken,
          }
        )
        const sessionDoc = sessions.at(0)
        if (sessionDoc && session.expires) {
          const sessionId = sessionDoc.id
          const doc: Partial<SessionDoc<RecordId<string>>> | null =
            removeUndefinedFields(
              sessionToDoc({
                ...sessionDoc,
                ...session,
                userId: sessionDoc.userId.toString(),
                expires: session.expires,
              })
            )
          if (doc) {
            const updatedSession = await surreal.merge<
              SessionDoc,
              Partial<SessionDoc<RecordId<string>>>
            >(sessionId, doc)
            if (updatedSession?.id) {
              return docToSession(updatedSession)
            }
          }
        }
      } catch {}
      return null
    },
    async deleteSession(sessionToken: string) {
      const surreal = await client
      try {
        const [sessions] = await surreal.query<[SessionDoc[]]>(
          `SELECT * FROM session WHERE sessionToken = $sessionToken LIMIT 1`,
          {
            sessionToken,
          }
        )
        const session = sessions.at(0)
        if (session) {
          await surreal.delete(session.id)
          return
        }
      } catch {}
    },
    async createVerificationToken(verificationToken: VerificationToken) {
      try {
        const surreal = await client
        const doc = verificationTokenToDoc(verificationToken)

        const verificationTokenDocs = await surreal.create<
          VerificationTokenDoc,
          Omit<VerificationTokenDoc, "id">
        >("verification_token", doc)
        if (verificationTokenDocs.length) {
          const verificationTokenDoc: Partial<VerificationTokenDoc> =
            verificationTokenDocs[0]
          if (verificationTokenDoc.id) delete verificationTokenDoc.id
          return docToVerificationToken(
            verificationTokenDoc as VerificationTokenDoc
          )
        }
      } catch {}
      throw new Error("Verification Token not created")
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
        const [tokens] = await surreal.query<[VerificationTokenDoc[]]>(
          `SELECT * FROM verification_token WHERE identifier = $identifier AND token = $vt LIMIT 1`,
          { identifier, vt: token }
        )
        if (tokens.length && tokens.at(0)) {
          const vt = tokens[0]
          if (vt) {
            await surreal.delete(vt.id)
            const verificationTokenDoc: Partial<VerificationTokenDoc> = vt
            if (verificationTokenDoc.id) delete verificationTokenDoc.id
            return docToVerificationToken(
              verificationTokenDoc as VerificationTokenDoc
            )
          }
        } else {
          return null
        }
      } catch {}
      throw new Error("Verification Token not used")
    },
    async getAccount(
      providerAccountId: AdapterAccount["providerAccountId"],
      provider: AdapterAccount["provider"]
    ) {
      const surreal = await client
      try {
        const [accountsDoc] = await surreal.query<[AccountDoc[]]>(
          `SELECT * FROM account WHERE providerAccountId = $pid AND provider = $provider LIMIT 1`,
          {
            pid: providerAccountId,
            provider,
          }
        )
        if (accountsDoc.length) {
          return docToAccount(accountsDoc[0])
        }
      } catch {}
      return null
    },
    async createAuthenticator(authenticator: AdapterAuthenticator) {
      try {
        const surreal = await client
        const authenticatorDoc = await surreal.create<
          AuthenticatorDoc,
          Omit<AuthenticatorDoc, "id">
        >("authenticator", authenticatorToDoc(authenticator))
        if (authenticatorDoc.length) {
          return docToAuthenticator(authenticatorDoc[0])
        }
      } catch {}
      throw new Error("Authenticator not created")
    },
    async getAuthenticator(credentialId: AdapterAuthenticator["credentialID"]) {
      const surreal = await client
      try {
        const [authenticatorDoc] = await surreal.query<[AuthenticatorDoc[]]>(
          `SELECT * FROM authenticator WHERE credentialID = $cid LIMIT 1`,
          {
            cid: credentialId,
          }
        )
        if (authenticatorDoc.length) {
          return docToAuthenticator(authenticatorDoc[0])
        }
      } catch {}
      return null
    },
    async listAuthenticatorsByUserId(userId: AdapterAuthenticator["userId"]) {
      const surreal = await client
      try {
        const [authenticatorDocs] = await surreal.query<[AuthenticatorDoc[]]>(
          `SELECT * FROM authenticator WHERE userId = $userId LIMIT 1`,
          {
            userId,
          }
        )

        return authenticatorDocs.map((v) => docToAuthenticator(v))
      } catch {}
      throw new Error("Verification Token not found")
    },
    async updateAuthenticatorCounter(
      credentialId: AdapterAuthenticator["credentialID"],
      newCounter: AdapterAuthenticator["counter"]
    ) {
      try {
        if (!credentialId) throw new Error("credential id is required")
        const surreal = await client
        const [authenticatorDoc] = await surreal.query<[AuthenticatorDoc]>(
          `UPDATE ONLY authenticator MERGE $doc WHERE credentialID = $cid`,
          {
            cid: credentialId,
            doc: {
              counter: newCounter,
            },
          }
        )
        return docToAuthenticator(authenticatorDoc)
      } catch {}
      throw Error(
        `Unable to update authenticator with credential ${credentialId}`
      )
    },
  }
}
