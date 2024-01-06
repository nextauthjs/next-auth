import { runBasicTests } from "utils/adapter"
import { TypeORMAdapter } from "../../src"
import { db } from "../helpers"

const mysqlConfig = {
  type: "mysql" as const,
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "next-auth",
  synchronize: true,
}

runBasicTests({
  adapter: TypeORMAdapter(mysqlConfig),
  db: db(mysqlConfig),
})
