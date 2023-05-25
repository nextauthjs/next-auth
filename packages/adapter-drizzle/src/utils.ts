import { MySqlDatabase, MySqlTableWithColumns } from "drizzle-orm/mysql-core"
import { PgDatabase, PgTableWithColumns } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core"
import { Schema as PgSchema } from "./pg/schema"
import { Schema as MySqlSchema } from "./mysql/schema"
import { Schema as SQLiteSchema } from "./sqlite/schema"

export type Flavors<T> = T extends "mysql" | "pg" | "sqlite" ? T extends "mysql" ? MySqlDatabase<any, any> :
  T extends "pg" ? PgDatabase<any, PgSchema, any> :
  T extends "sqlite" ? BaseSQLiteDatabase<any, any> :
  never : never

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, MySqlTableWithColumns<any>>
  pg: PgSchema & Record<string, PgTableWithColumns<any>>,
  sqlite: SQLiteSchema & Record<string, SQLiteTableWithColumns<any>>
}