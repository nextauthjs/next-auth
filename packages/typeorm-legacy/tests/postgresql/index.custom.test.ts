import { runBasicTests } from "../../../../basic-tests"
import { TypeORMLegacyAdapter } from "../../src"
import * as entities from "../custom-entities"
import { db } from "../helpers"

const postgresConfig =
  "postgres://nextauth:password@localhost:5432/nextauth?synchronize=true"

runBasicTests({
  adapter: TypeORMLegacyAdapter(postgresConfig, {
    entities,
  }),
  db: db(postgresConfig, entities),
})
