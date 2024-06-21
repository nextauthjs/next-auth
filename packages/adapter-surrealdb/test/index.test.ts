import Surreal from "surrealdb.js"
import { runBasicTests } from "utils/adapter"

import { config } from "./common"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal()
  try {
    await db.connect("http://0.0.0.0:8000/rpc", {
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
