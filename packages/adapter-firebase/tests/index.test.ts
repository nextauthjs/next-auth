import { runBasicTests } from "@next-auth/adapter-test"
import { FirebaseAdapter } from "../src"
import { docSnapshotToObject, querySnapshotToObject } from "../src/utils"

import firebase from "firebase/app"
import "firebase/firestore"

const firestore = (
  firebase.apps[0] ?? firebase.initializeApp({ projectId: "next-auth-test" })
).firestore()
firestore.useEmulator("localhost", 8080)

runBasicTests({
  adapter: FirebaseAdapter(firestore),
  db: {
    async disconnect() {
      await firestore.terminate()
    },
    async session(sessionToken) {
      const snapshot = await firestore
        .collection("sessions")
        .where("sessionToken", "==", sessionToken)
        .limit(1)
        .get()
      return querySnapshotToObject(snapshot)
    },
    async expireSession(sessionToken, expires) {
      const snapshot = await firestore
        .collection("sessions")
        .where("sessionToken", "==", sessionToken)
        .limit(1)
        .get()

      if (snapshot.empty) {
        console.error(sessionToken, expires)
        throw new Error("Could not expire session")
      }

      return await firestore
        .collection("sessions")
        .doc(snapshot.docs[0].id)
        .update({ expires })
    },
    async user(id) {
      const snapshot = await firestore.collection("users").doc(id).get()
      return docSnapshotToObject(snapshot)
    },
    async account(providerId, providerAccountId) {
      const snapshot = await firestore
        .collection("accounts")
        .where("providerId", "==", providerId)
        .where("providerAccountId", "==", providerAccountId)
        .limit(1)
        .get()
      return querySnapshotToObject(snapshot)
    },
    async verificationRequest(identifier, token) {
      const snapshot = await firestore
        .collection("verificationRequests")
        .where("identifier", "==", identifier)
        .where("token", "==", token)
        .limit(1)
        .get()
      return querySnapshotToObject(snapshot)
    },
  },
})
