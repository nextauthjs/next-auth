import type firebase from "firebase"

/**
 * Takes in a snapshot and returns all of its `data()`,
 * as well as `id` and `createdAt` and `updatedAt` `Date`
 */
export function docSnapshotToObject<T>(
  snapshot: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): T | null {
  if (!snapshot.exists) {
    return null
  }
  const data: any = snapshot.data()
  if (data.expires) {
    data.expires = data.expires.toDate()
  }
  return { id: snapshot.id, ...data }
}

export function querySnapshotToObject<T>(
  snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
): T | null {
  if (snapshot.empty) {
    return null
  }
  const doc = snapshot.docs[0]

  const data: any = doc.data()
  if (data.expires) {
    data.expires = data.expires.toDate()
  }
  return { id: doc.id, ...data }
}

/** Firebase does not like `undefined` values */
export function stripUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => typeof value !== "undefined")
  )
}
