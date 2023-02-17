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
 * npm install next-auth @next-auth/firebase-adapter firebase-admin
 * ```
 *
 * ## References
 * - [`GOOGLE_APPLICATION_CREDENTIALS` environment variable](https://cloud.google.com/docs/authentication/application-default-credentials#GAC)
 * - [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup#initialize-sdk)
 *
 * @module @next-auth/firebase-adapter
 */

import { type AppOptions } from "firebase-admin"
import { Firestore } from "firebase-admin/firestore"

import type { Adapter, AdapterUser } from "next-auth/adapters"
import {
  collestionsFactory,
  deleteDocs,
  initFirestore,
  getDoc,
  getOneDoc,
  mapFieldsFactory,
} from "./utils.js"

export { initFirestore } from "./utils.js"

/** Configure the Firebase Adapter. */
export interface FirebaseAdapterConfig extends AppOptions {
  /**
   * The name of the app passed to {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.md#initializeapp `initializeApp()`}.
   */
  name?: string
  firestore?: Firestore
  /**
   * Use this option if mixed `snake_case` and `camelCase` field names in the database is an issue for you.
   * Passing `snake_case` will convert all field and collection names to `snake_case`.
   * E.g. the collection `verificationTokens` will be `verification_tokens`,
   * and fields like `emailVerified` will be `email_verified` instead.
   *
   *
   * @example
   * ```ts title="pages/api/auth/[...nextauth].ts"
   * import NextAuth from "next-auth"
   * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
   *
   * export default NextAuth({
   *  adapter: FirestoreAdapter({ namingStrategy: "snake_case" })
   *  // ...
   * })
   * ```
   */
  namingStrategy?: "snake_case"
}

/**
 * #### Usage
 *
 * First, create a Firebase project and generate a service account key.
 * Visit: `https://console.firebase.google.com/u/0/project/{project-id}/settings/serviceaccounts/adminsdk` (replace `{project-id}` with your project's id)
 *
 * Now you have a few options to authenticate with the Firebase Admin SDK in your app:
 *
 * ##### 1. `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
 *  - Download the service account key and save it in your project. (Make sure to add the file to your `.gitignore`!)
 *  - Add [`GOOGLE_APPLICATION_CREDENTIALS`](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) to your environment variables and point it to the service account key file.
 *  - The adapter will automatically pick up the environment variable and use it to authenticate with the Firebase Admin SDK.
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 *
 * export default NextAuth({
 *   adapter: FirestoreAdapter(),
 *   // ...
 * })
 * ```
 *
 * ##### 2. Service account values as environment variables
 *
 * - Download the service account key to a temporary location. (Make sure to not commit this file to your repository!)
 * - Add the following environment variables to your project: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
 * - Pass the config to the adapter, using the environment variables as shown in the example below.
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 * import { cert } from "firebase-admin/app"
 *
 * export default NextAuth({
 *  adapter: FirestoreAdapter({
 *    credential: cert({
 *      projectId: process.env.FIREBASE_PROJECT_ID,
 *      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
 *      privateKey: process.env.FIREBASE_PRIVATE_KEY,
 *    })
 *  })
 *  // ...
 * })
 * ```
 *
 * ##### 3. Use an existing Firestore instance
 *
 * If you already have a Firestore instance, you can pass that to the adapter directly instead.
 *
 * :::note
 * When passing an instance and in a serverless environment, remember to handle duplicate app initialization.
 * :::
 *
 * :::tip
 * You can use the {@link initFirestore} utility to initialize the app and get an instance safely.
 * :::
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 * import { firestore } from "lib/firestore"
 *
 * export default NextAuth({
 *  adapter: FirestoreAdapter(firestore),
 *  // ...
 * })
 * ```
 */
export function FirestoreAdapter(
  config?: FirebaseAdapterConfig | Firestore
): Adapter {
  const { db, namingStrategy = "default" } =
    config instanceof Firestore
      ? { db: config }
      : { ...config, db: config?.firestore ?? initFirestore(config) }

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
