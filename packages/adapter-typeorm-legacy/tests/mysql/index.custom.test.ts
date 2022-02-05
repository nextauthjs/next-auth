import { runBasicTests } from "../../../adapter-test"
import { TypeORMLegacyAdapter } from "../../src"
import * as entities from "../custom-entities"
import { db } from "../helpers"
import { SnakeNamingStrategy } from "typeorm-naming-strategies"

import type { ConnectionOptions } from "typeorm"

const mysqlConfig: ConnectionOptions = {
  type: "mysql" as const,
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "next-auth",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
}

runBasicTests({
  adapter: TypeORMLegacyAdapter(mysqlConfig, {
    entities,
  }),
  db: db(mysqlConfig, entities),
})
