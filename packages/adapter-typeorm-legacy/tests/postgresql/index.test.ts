import { runBasicTests } from "../../../adapter-test"
import { TypeORMLegacyAdapter } from "../../src"
import { db } from "../helpers"

const postgresConfig =
  "postgres://nextauth:password@localhost:5432/nextauth?synchronize=true"

runBasicTests({
  adapter: TypeORMLegacyAdapter(postgresConfig),
  db: db(postgresConfig),
})
