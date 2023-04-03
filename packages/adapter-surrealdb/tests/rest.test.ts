import { SurrealREST } from "surrealdb-rest-ts"
import type Surreal from "surrealdb.js"
import { runBasicTests } from "@next-auth/adapter-test"

import { config } from "./common"

const clientPromise = new Promise<Surreal>((resolve) => {
  resolve(
    new SurrealREST("http://localhost:8000", {
      ns: "test",
      db: "rest",
      user: "test",
      password: "test",
    }) as unknown as Surreal
  )
})

runBasicTests(config(clientPromise))
