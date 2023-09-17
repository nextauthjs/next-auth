import Surreal from "surrealdb.js"
import { runBasicTests } from "@auth/adapter-test"

import { config } from "./common"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal();
  try {
    await db.connect('http://0.0.0.0:8000/rpc', {
      ns: "test",
      db: "test",
      auth: {
        user: "test",
        pass: "test",
      }
    })
    resolve(db)
  } catch (e) {
    reject(e)
  }
})

runBasicTests(config(clientPromise))
