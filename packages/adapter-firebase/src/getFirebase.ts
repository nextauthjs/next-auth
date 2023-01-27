import { initializeApp, getApps, FirebaseOptions } from "firebase/app"

export default function getFirebase(firebaseOptions: FirebaseOptions) {
  const apps = getApps()
  const app = apps.find((app) => app.name === firebaseOptions.projectId)
  if (app) {
    return app
  } else {
    return initializeApp(firebaseOptions)
  }
}
