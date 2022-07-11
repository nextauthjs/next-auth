import { Timestamp } from "firebase/firestore"
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"

const isTimestamp = (value: unknown): value is Timestamp =>
  typeof value === "object" && value !== null && value instanceof Timestamp

interface GetConverterOptions {
  excludeId?: boolean
}

export const getConverter = <Document extends Record<string, unknown>>(
  options?: GetConverterOptions
): FirestoreDataConverter<Document> => ({
  // `PartialWithFieldValue` implicitly types `object` as `any`, so we want to explicitly type it
  toFirestore(object: WithFieldValue<Document>) {
    const document: Record<string, unknown> = {}

    Object.keys(object).forEach((key) => {
      if (object[key] !== undefined) {
        document[key] = object[key]
      }
    })

    return document
  },
  // We need to explicitly type `snapshot` since it uses `DocumentData` for generic type
  fromFirestore(snapshot: QueryDocumentSnapshot<Document>) {
    if (!snapshot.exists()) {
      return snapshot
    }

    let document: Document = snapshot.data()

    if (!options?.excludeId) {
      document = {
        ...document,
        id: snapshot.id,
      }
    }

    for (const key in document) {
      const value = document[key]

      if (isTimestamp(value)) {
        document = {
          ...document,
          [key]: value.toDate(),
        }
      }
    }

    return document
  },
})
