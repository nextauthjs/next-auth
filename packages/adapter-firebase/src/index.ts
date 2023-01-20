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

import { type AppOptions } from "firebase-admin/app"

import type { Adapter, AdapterUser } from "next-auth/adapters"
import {
  collestionsFactory,
  deleteDocs,
  firestore,
  getDoc,
  getOneDoc,
  mapFieldsFactory,
} from "./utils"

/** Configure the Firebase Adapter. */
export interface FirebaseAdapterConfig extends AppOptions {
  /**
   * The name of the app passed to {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.md#initializeapp `initializeApp()`}.
   */
  appName?: string
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
 * 1. Create a Firebase project and generate a service account key. `https://console.firebase.google.com/u/0/project/{project-id}/settings/serviceaccounts/adminsdk`
 * 2. Download the service account key and save it in your project. (Make sure to add it to your `.gitignore`!)
 * 3. Add `GOOGLE_APPLICATION_CREDENTIALS` to your environment variables and point it to the service account key file.
 * 4. Add the adapter to your Auth.js / NextAuth.js configuration.
 *
 * ##### References
 * - [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup)
 * - [`GOOGLE_APPLICATION_CREDENTIALS`](https://cloud.google.com/docs/authentication/application-default-credentials#GAC)
 *
 * ##### Example
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 *
 * export default NextAuth({
 *   adapter: FirestoreAdapter(),
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
export function FirestoreAdapter(config?: FirebaseAdapterConfig): Adapter {
  const { namingStrategy = "default", appName, ...appOptions } = config ?? {}
  const db = firestore(appOptions, appName)

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
