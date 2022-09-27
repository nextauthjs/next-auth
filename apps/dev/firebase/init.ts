const admin = require("firebase-admin")
const serviceAccount = require("./firebaseky.json")

export function init() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DB_URL,
    })

    admin.firestore().settings({ ignoreUndefinedProperties: true })
  }
}
