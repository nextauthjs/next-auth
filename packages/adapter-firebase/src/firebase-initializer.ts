import { getApp, getApps, initializeApp } from "firebase/app"
import type { FirebaseOptions } from "firebase/app"

export const getFirebaseApp = (options: FirebaseOptions) => {
  if (getApps().length === 0) {
    return initializeApp(options)
  }

  return getApp()
}
