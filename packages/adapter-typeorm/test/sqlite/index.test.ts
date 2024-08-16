import { runBasicTests } from "utils/adapter"
import { TypeORMAdapter } from "../../src"
import { db } from "../helpers"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

import type { DataSourceOptions } from "typeorm"

const sqliteConfig: DataSourceOptions = {
  type: "sqlite" as const,
  name: "next-auth-test-memory",
  database: "./test/sqlite/dev.db",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
}

runBasicTests({
  adapter: TypeORMAdapter(sqliteConfig),
  db: db(sqliteConfig),
})
