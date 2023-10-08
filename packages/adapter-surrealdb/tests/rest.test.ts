import { ExperimentalSurrealHTTP } from "surrealdb.js"
import { runBasicTests } from "@auth/adapter-test"
import fetch from "node-fetch"

import { config } from "./common"

const clientPromise = new Promise<ExperimentalSurrealHTTP<typeof fetch>>(async (resolve, reject) => {
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
})

runBasicTests(config(clientPromise))
