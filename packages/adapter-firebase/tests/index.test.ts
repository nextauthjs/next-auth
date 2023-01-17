import admin, { FirebaseArrayIndexError } from "firebase-admin"
import { runBasicTests } from "@next-auth/adapter-test"

import {
  FirestoreAdapter,
  type FirestoreAdapterOptions,
  mapFieldsFactory,
  collestionsFactory,
  getOneDoc,
  getDoc,
} from "../src"

describe.each([
  { preferSnakeCase: true },
  { preferSnakeCase: false },
] as Partial<FirestoreAdapterOptions>[])(
  "FirebaseAdapter with config: %s",
  (config) => {
    const app = admin.initializeApp(
      { projectId: "next-auth-test", databaseURL: "http://localhost:8080" },
      `next-auth-test-${config.preferSnakeCase}`
    )
    const db = app.firestore()

    const mapper = mapFieldsFactory(config.preferSnakeCase)

    const C = collestionsFactory(db, config.preferSnakeCase)

    for (const [name, collection] of Object.entries(C)) {
      test(`collection "${name}" should be empty`, async () => {
        expect((await collection.count().get()).data().count).toBe(0)
      })
    }

    runBasicTests({
      adapter: FirestoreAdapter({ ...config, db }),
      db: {
        disconnect: db.terminate,
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
)
