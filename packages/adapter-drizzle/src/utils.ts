import { AnyMySqlTable, MySqlDatabase, MySqlTable } from "drizzle-orm/mysql-core"
import { AnyPgTable, PgDatabase } from "drizzle-orm/pg-core"
import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
import { Schema as PgSchema } from "./pg/schema"
import { Schema as MySqlSchema } from "./mysql/schema"
import { Schema as SQLiteSchema } from "./sqlite/schema"
import { Schema as PlanetScaleSchema } from "./planetscale/schema"

export type AnyMySqlDatabase = MySqlDatabase<any, any>
export type AnyPgDatabase = PgDatabase<any, any, any>
export type AnySQLiteDatabase = BaseSQLiteDatabase<any, any>
export type AnyPlanetScaleDatabase = PlanetScaleDatabase<any>

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, AnyMySqlTable>
  pg: PgSchema & Record<string, AnyPgTable>
  sqlite: SQLiteSchema & Record<string, AnySQLiteTable>
  planetscale: PlanetScaleSchema & Record<string, AnyMySqlTable>
}

export type SqlFlavorOptions = AnyMySqlDatabase
  | AnyPgDatabase
  | AnySQLiteDatabase
  | AnyPlanetScaleDatabase

export type ClientFlavors<Flavor> = Flavor extends AnyMySqlDatabase
  ? MinimumSchema["mysql"]
  : Flavor extends AnyPgDatabase
  ? MinimumSchema["pg"]
  : Flavor extends AnySQLiteDatabase
  ? MinimumSchema["sqlite"]
  : Flavor extends AnyPlanetScaleDatabase
  ? MinimumSchema["planetscale"]
  : never

export function isMySqlDatabase(db: any): db is MySqlDatabase<any, any> {
  return db instanceof MySqlDatabase<any, any>
}

export function isPgDatabase(db: any): db is PgDatabase<any, any, any> {
  return db instanceof PgDatabase<any, any, any>
}

export function isSQLiteDatabase(db: any): db is BaseSQLiteDatabase<any, any> {
  return db instanceof BaseSQLiteDatabase<any, any>
}

export function isPlanetScaleDatabase(db: any): db is PlanetScaleDatabase<any> {
  // PlanetScaleDatabase is a type (not a class) so we can't use instanceof
  return db
}