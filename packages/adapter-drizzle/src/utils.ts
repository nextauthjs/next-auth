import { AnyMySqlTable, MySqlDatabase, } from "drizzle-orm/mysql-core"
import { AnyPgTable, PgDatabase } from "drizzle-orm/pg-core"
import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { Schema as PgSchema } from "./pg/schema"
import { Schema as MySqlSchema } from "./mysql/schema"
import { Schema as SQLiteSchema } from "./sqlite/schema"

export type Flavors<T> = T extends "mysql" | "pg" | "sqlite" ? T extends "mysql" ? MySqlDatabase<any, any> :
  T extends "pg" ? PgDatabase<any, PgSchema, any> :
  T extends "sqlite" ? BaseSQLiteDatabase<any, any> :
  never : never

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, AnyMySqlTable>
  pg: PgSchema & Record<string, AnyPgTable>,
  sqlite: SQLiteSchema & Record<string, AnySQLiteTable>
}