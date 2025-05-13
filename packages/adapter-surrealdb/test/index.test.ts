import { Surreal } from "surrealdb"
import { runBasicTests } from "utils/adapter"

import { config } from "./common"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  try {
    const db = new Surreal()
    await db.connect("ws://0.0.0.0:8000", {
      namespace: "test",
      database: "test",
      auth: {
        username: "test",
        password: "test",
      },
    })
    resolve(db)
  } catch (e) {
    reject(e)
  }
})

runBasicTests(config(clientPromise))
