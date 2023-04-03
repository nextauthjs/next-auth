import Surreal from "surrealdb.js"
import { runBasicTests } from "@next-auth/adapter-test"

import { config } from "./common"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal("http://localhost:8000/rpc")
  try {
    await db.signin({
      user: "test",
      pass: "test",
    })
    await db.use("test", "test")
    resolve(db)
  } catch (e) {
    reject(e)
  }
})

runBasicTests(config(clientPromise))
