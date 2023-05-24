import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { Schema as PgSchema } from "./pg/schema"
import { Schema as MySqlSchema } from "./mysql/schema"
import { Schema as SQLiteSchema } from "./sqlite/schema"

export function isMySqlDatabase(
  db: any
): db is MySqlDatabase<any, any, MySqlSchema> {
  return db instanceof MySqlDatabase<any, any>
}

export function isPgDatabase(db: any): db is PgDatabase<any, PgSchema, any> {
  return db instanceof PgDatabase<any, any>
}

export function isSQLiteDatabase(
  db: any
): db is BaseSQLiteDatabase<any, any, SQLiteSchema> {
  return db instanceof BaseSQLiteDatabase<any, any>
}
