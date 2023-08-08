import { AnyMySqlTable, MySqlDatabase } from "drizzle-orm/mysql-core"
import { AnyPgTable, PgDatabase } from "drizzle-orm/pg-core"
import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { DefaultSchema as PgSchema } from "./pg"
import { DefaultSchema as MySqlSchema } from "./mysql"
import { DefaultSchema as SQLiteSchema } from "./sqlite"

export type AnyMySqlDatabase = MySqlDatabase<any, any>
export type AnyPgDatabase = PgDatabase<any, any, any>
export type AnySQLiteDatabase = BaseSQLiteDatabase<any, any, any, any>

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, AnyMySqlTable>
  pg: PgSchema & Record<string, AnyPgTable>
  sqlite: SQLiteSchema & Record<string, AnySQLiteTable>
}

export type SqlFlavorOptions =
  | AnyMySqlDatabase
  | AnyPgDatabase
  | AnySQLiteDatabase

export type ClientFlavors<Flavor> = Flavor extends AnyMySqlDatabase
  ? MinimumSchema["mysql"]
  : Flavor extends AnyPgDatabase
  ? MinimumSchema["pg"]
  : Flavor extends AnySQLiteDatabase
  ? MinimumSchema["sqlite"]
  : never

export function isMySqlDatabase(
  db: any
): db is MySqlDatabase<any, any, any, any> {
  return db instanceof MySqlDatabase
}

export function isPgDatabase(db: any): db is PgDatabase<any, any, any> {
  return db instanceof PgDatabase
}

export function isSQLiteDatabase(db: any): db is AnySQLiteDatabase {
  return db instanceof BaseSQLiteDatabase
}
