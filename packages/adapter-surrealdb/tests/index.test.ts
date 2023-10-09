import Surreal, { ExperimentalSurrealHTTP } from "surrealdb.js"
import { runBasicTests } from "@auth/adapter-test"
import fetch from "node-fetch"

import { config } from "./common"

const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal()
  try {
    await db.connect("http://0.0.0.0:8000/rpc", {
      ns: "test",
      db: "test",
      auth: {
        user: "test",
        pass: "test",
      },
    })
    resolve(db)
  } catch (e) {
    reject(e)
  }
})

runBasicTests(config(clientPromise))

const clientPromiseRest = new Promise<ExperimentalSurrealHTTP<typeof fetch>>(
  async (resolve, reject) => {
    try {
      const db = new ExperimentalSurrealHTTP("http://0.0.0.0:8000", {
        fetch,
        auth: {
          user: "test",
          pass: "test",
        },
        ns: "test",
        db: "test",
      })
      resolve(db)
    } catch (e) {
      reject(e)
    }
  }
)

runBasicTests(config(clientPromiseRest))
