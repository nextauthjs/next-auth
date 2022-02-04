import { runBasicTests } from "../../../adapter-test"
import { TypeORMLegacyAdapter } from "../../src"
import { db } from "../helpers"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

import type { ConnectionOptions } from "typeorm"

const sqliteConfig: ConnectionOptions = {
  type: "sqlite" as const,
  name: "next-auth-test-memory",
  database: "./tests/sqlite/dev.db",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
}

runBasicTests({
  adapter: TypeORMLegacyAdapter(sqliteConfig),
  db: db(sqliteConfig),
})
