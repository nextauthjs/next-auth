import { type AppOptions, getApps, initializeApp } from "firebase-admin/app"
import {
  getFirestore,
  initializeFirestore,
  Timestamp,
} from "firebase-admin/firestore"

import type {
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
          console.warn(`FirebaseAdapter: value for key "${key}" is undefined`)
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
        if (value instanceof Timestamp) value = value.toDate()

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

export function firestore(appOptions: AppOptions, name?: string) {
  const apps = getApps()
  const app = name ? apps.find((a) => a.name === name) : apps[0]

  if (app) return getFirestore(app)

  return initializeFirestore(initializeApp(appOptions, name))
}
