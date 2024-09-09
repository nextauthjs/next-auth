import { runBasicTests } from "utils/adapter"
import { TypeORMAdapter } from "../../src"
import * as entities from "../custom-entities"
import { db } from "../helpers"

const sqliteConfig = {
  type: "better-sqlite3" as const,
  name: "next-auth-test-memory",
  database: "./test/sqlite/dev.db",
  synchronize: true,
}

runBasicTests({
  adapter: TypeORMAdapter(sqliteConfig, {
    entities,
  }),
  db: db(sqliteConfig, entities),
})
