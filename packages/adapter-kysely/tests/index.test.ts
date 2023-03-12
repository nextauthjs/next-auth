import { Kysely, PostgresDialect } from "kysely"
import KyselyAdapter from "../src/index"
import { Pool } from "pg"
import { DB } from "../src/dbTypes"
import { dbHelper } from "./dbTestOptions"
import { runBasicTests } from "@next-auth/adapter-test"

const dbKysely = new Kysely<DB>({
  log: ["error", "query"],
  dialect: new PostgresDialect({
    pool: new Pool({
      host: "127.0.0.1",
      database: "nextauth",
      user: "nextauth",
      port: 5432,
    }),
  }),
})

runBasicTests({
  adapter: KyselyAdapter(dbKysely),
  db: dbHelper(dbKysely),
})
