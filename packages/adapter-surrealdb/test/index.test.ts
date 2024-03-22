import Surreal, { ExperimentalSurrealHTTP } from "surrealdb.js"
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

// const clientPromiseRest = new Promise<ExperimentalSurrealHTTP<typeof fetch>>(
//   async (resolve, reject) => {
//     try {
//       const db = new ExperimentalSurrealHTTP("http://0.0.0.0:8000", {
//         fetch,
//         auth: {
//           user: "test",
//           pass: "test",
//         },
//         ns: "test",
//         db: "test",
//       })
//       resolve(db)
//     } catch (e) {
//       reject(e)
//     }
//   }
// )

// TODO: Revisit and fix this test - currently updateUser and deleteUser are failing.
// runBasicTests(config(clientPromiseRest))
