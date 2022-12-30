import admin from "firebase-admin"
import { runBasicTests } from "@next-auth/adapter-test"

import {
  FirestoreAdminAdapter,
  mapFieldsFactory,
  collectionsFactory,
  getOneDoc,
  getDoc,
} from "../src"

for (const preferSnakeCase of [true, false]) {
  const app = admin.initializeApp(
    {
      projectId: "next-auth-admin-test",
      databaseURL: "http://localhost:8080",
    },
    `next-auth-admin-test-${preferSnakeCase}`
  )
  const firestore = app.firestore()

  const mapper = mapFieldsFactory(preferSnakeCase)

  const C = collectionsFactory(firestore, preferSnakeCase)

  runBasicTests({
    adapter: FirestoreAdminAdapter(firestore, { preferSnakeCase }),
    db: {
      disconnect: async () => {
        await firestore.terminate()
      },
      session: (sessionToken) =>
        getOneDoc(
          C.sessions.where(mapper.toDb("sessionToken"), "==", sessionToken)
        ),
      user: (userId) => getDoc(C.users.doc(userId)),
      account: ({ provider, providerAccountId }) =>
        getOneDoc(
          C.accounts
            .where("provider", "==", provider)
            .where(mapper.toDb("providerAccountId"), "==", providerAccountId)
        ),
      verificationToken: ({ identifier, token }) =>
        getOneDoc(
          C.verification_tokens
            .where("identifier", "==", identifier)
            .where("token", "==", token)
        ),
    },
  })
}
