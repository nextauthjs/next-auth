/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 * <span>
 *  Official <b>Firebase</b> adapter for Auth.js / NextAuth.js,
 *  using the <a href="https://firebase.google.com/docs/admin/setup">Firebase Admin SDK</a>
 *  &nbsp;and <a href="https://firebase.google.com/docs/firestore">Firestore</a>.</span>
 * <a href="https://firebase.google.com/">
 *   <img style={{display: "block"}} src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/adapter-firebase/logo.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/firebase-admin-adapter firebase-admin
 * ```
 *
 * @module @next-auth/firebase-adapter
 */

import { firestore } from "firebase-admin"

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters"

// for consistency, store all fields as snake_case in the database
const MAP_TO_FIRESTORE: Record<string, string | undefined> = {
  userId: "user_id",
  sessionToken: "session_token",
  providerAccountId: "provider_account_id",
  emailVerified: "email_verified",
}
const MAP_FROM_FIRESTORE: Record<string, string | undefined> = {}

for (const key in MAP_TO_FIRESTORE) {
  MAP_FROM_FIRESTORE[MAP_TO_FIRESTORE[key]!] = key
}

const identity = <T>(x: T) => x

/** @internal */
export function mapFieldsFactory(preferSnakeCase?: boolean) {
  if (preferSnakeCase) {
    return {
      toDb: (field: string) => MAP_TO_FIRESTORE[field] ?? field,
      fromDb: (field: string) => MAP_FROM_FIRESTORE[field] ?? field,
    }
  }
  return { toDb: identity, fromDb: identity }
}

/** @internal */
export function getConverter<Document extends Record<string, any>>(options: {
  excludeId?: boolean
  preferSnakeCase?: boolean
}): FirebaseFirestore.FirestoreDataConverter<Document> {
  const mapper = mapFieldsFactory(options?.preferSnakeCase ?? false)

  return {
    toFirestore(object) {
      const document: Record<string, unknown> = {}

      for (const key in object) {
        if (key === "id") continue
        const value = object[key]
        if (value !== undefined) {
          document[mapper.toDb(key)] = value
        } else {
          console.warn(
            `FirestoreAdapterAdmin: value for key "${key}" is undefined`
          )
        }
      }

      return document
    },

    fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot<Document>
    ): Document {
      const document = snapshot.data()! // we can guarentee it exists

      const object: Record<string, unknown> = {}

      if (!options?.excludeId) {
        object.id = snapshot.id
      }

      for (const key in document) {
        let value: any = document[key]
        if (value instanceof firestore.Timestamp) value = value.toDate()

        object[mapper.fromDb(key)] = value
      }

      return object as Document
    },
  }
}

/** @internal */
export async function getOneDoc<T>(
  querySnapshot: FirebaseFirestore.Query<T>
): Promise<T | null> {
  const querySnap = await querySnapshot.limit(1).get()
  return querySnap.docs[0]?.data() ?? null
}

/** @internal */
export async function deleteDocs<T>(
  querySnapshot: FirebaseFirestore.Query<T>
): Promise<void> {
  const querySnap = await querySnapshot.get()
  for (const doc of querySnap.docs) {
    await doc.ref.delete()
  }
}

/** @internal */
export async function getDoc<T>(
  docRef: FirebaseFirestore.DocumentReference<T>
): Promise<T | null> {
  const docSnap = await docRef.get()
  return docSnap.data() ?? null
}

/** @internal */
export function collestionsFactory(
  db: FirebaseFirestore.Firestore,
  preferSnakeCase = false
) {
  return {
    users: db
      .collection("users")
      .withConverter(getConverter<AdapterUser>({ preferSnakeCase })),
    sessions: db
      .collection("sessions")
      .withConverter(getConverter<AdapterSession>({ preferSnakeCase })),
    accounts: db
      .collection("accounts")
      .withConverter(getConverter<AdapterAccount>({ preferSnakeCase })),
    verification_tokens: db
      .collection(
        preferSnakeCase ? "verification_tokens" : "verificationTokens"
      )
      .withConverter(
        getConverter<VerificationToken>({ preferSnakeCase, excludeId: true })
      ),
  }
}

/** Configure the Firebase Adapter. */
export interface FirestoreAdapterConfig {
  /**
   * A Firestore instance using the Firebase Admin SDK.
   * @example
   * ```ts
   * import admin from "firebase-admin"
   * const app = admin.initializeApp()
   * const firestore = app.firestore()
   * ```
   *
   * @see [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup)
   */
  db: FirebaseFirestore.Firestore
  /**
   * Use this option if mixed `snake_case` and `camelCase` field names in the database is an issue for you.
   * Passing `snake_case` convert all field and collection names to `snake_case`.
   * E.g. the collection `verificationTokens` will instead be `verification_tokens`,
   * and fields like `emailVerified` will be `email_verified` instead.
   *
   * @default "default"
   */
  namingStrategy?: "snake_case" | "default"
}

/**
 *
 * #### Usage
 *
 * 1. Create a Firebase project and generate a service account key. Refer to [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup).
 * 2. Add the adapter to your Auth.js / NextAuth.js configuration.
 *
 * @example
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 * import admin from "firebase-admin"
 *
 * // Initialize the Firebase admin app. By default, the Firebase Admin SDK will
 * // look for the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
 * // that to authenticate with the firebase project. See other authentication
 * // methods here: https://firebase.google.com/docs/admin/setup
 * const app = admin.initializeApp()
 * const db = app.firestore()
 *
 * export default NextAuth({
 *   adapter: FirestoreAdapter({ db }),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_ID,
 *       clientSecret: process.env.GOOGLE_SECRET,
 *     }),
 *   ],
 *   ...
 * })
 * ```
 */
export function FirestoreAdapter(config: FirestoreAdapterConfig): Adapter {
  const { db, namingStrategy } = config
  const preferSnakeCase = namingStrategy === "snake_case"
  const C = collestionsFactory(db, preferSnakeCase)
  const mapper = mapFieldsFactory(preferSnakeCase)

  return {
    async createUser(userInit) {
      const { id: userId } = await C.users.add(userInit as AdapterUser)

      const user = await getDoc(C.users.doc(userId))
      if (!user) throw new Error("[createUser] Failed to fetch created user")

      return user
    },

    async getUser(id) {
      return await getDoc(C.users.doc(id))
    },

    async getUserByEmail(email) {
      return await getOneDoc(C.users.where("email", "==", email))
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await getOneDoc(
        C.accounts
          .where("provider", "==", provider)
          .where(mapper.toDb("providerAccountId"), "==", providerAccountId)
      )
      if (!account) return null

      return await getDoc(C.users.doc(account.userId))
    },

    async updateUser(partialUser) {
      if (!partialUser.id) throw new Error("[updateUser] Missing id")

      const userRef = C.users.doc(partialUser.id)

      await userRef.set(partialUser, { merge: true })

      const user = await getDoc(userRef)
      if (!user) throw new Error("[updateUser] Failed to fetch updated user")

      return user
    },

    async deleteUser(userId) {
      await db.runTransaction(async (transaction) => {
        const accounts = await C.accounts
          .where(mapper.toDb("userId"), "==", userId)
          .get()
        const sessions = await C.sessions
          .where(mapper.toDb("userId"), "==", userId)
          .get()

        transaction.delete(C.users.doc(userId))

        accounts.forEach((account) => transaction.delete(account.ref))
        sessions.forEach((session) => transaction.delete(session.ref))
      })
    },

    async linkAccount(accountInit) {
      const ref = await C.accounts.add(accountInit)
      const account = await ref.get().then((doc) => doc.data())
      return account ?? null
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await deleteDocs(
        C.accounts
          .where("provider", "==", provider)
          .where(mapper.toDb("providerAccountId"), "==", providerAccountId)
          .limit(1)
      )
    },

    async createSession(sessionInit) {
      const ref = await C.sessions.add(sessionInit)
      const session = await ref.get().then((doc) => doc.data())

      if (session) return session ?? null

      throw new Error("[createSession] Failed to fetch created session")
    },

    async getSessionAndUser(sessionToken) {
      const session = await getOneDoc(
        C.sessions.where(mapper.toDb("sessionToken"), "==", sessionToken)
      )
      if (!session) return null

      const user = await getDoc(C.users.doc(session.userId))
      if (!user) return null

      return { session, user }
    },

    async updateSession(partialSession) {
      const sessionId = await db.runTransaction(async (transaction) => {
        const sessionSnapshot = (
          await transaction.get(
            C.sessions
              .where(
                mapper.toDb("sessionToken"),
                "==",
                partialSession.sessionToken
              )
              .limit(1)
          )
        ).docs[0]
        if (!sessionSnapshot?.exists) return null

        transaction.set(sessionSnapshot.ref, partialSession, { merge: true })

        return sessionSnapshot.id
      })

      if (!sessionId) return null

      const session = await getDoc(C.sessions.doc(sessionId))
      if (session) return session
      throw new Error("[updateSession] Failed to fetch updated session")
    },

    async deleteSession(sessionToken) {
      await deleteDocs(
        C.sessions
          .where(mapper.toDb("sessionToken"), "==", sessionToken)
          .limit(1)
      )
    },

    async createVerificationToken(verificationToken) {
      await C.verification_tokens.add(verificationToken)
      return verificationToken
    },

    async useVerificationToken({ identifier, token }) {
      const verificationTokenSnapshot = (
        await C.verification_tokens
          .where("identifier", "==", identifier)
          .where("token", "==", token)
          .limit(1)
          .get()
      ).docs[0]

      if (!verificationTokenSnapshot) return null

      const data = verificationTokenSnapshot.data()
      await verificationTokenSnapshot.ref.delete()
      return data
    },
  }
}
