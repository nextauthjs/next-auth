import { runBasicTests } from "utils/adapter"
import { TypeORMAdapter } from "../../src"
import { db } from "../helpers"

const postgresConfig =
  "postgres://nextauth:password@localhost:5432/nextauth?synchronize=true"

runBasicTests({
  adapter: TypeORMAdapter(postgresConfig),
  db: db(postgresConfig),
})
