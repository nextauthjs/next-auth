import { AnyMySqlTable, MySqlDatabase } from "drizzle-orm/mysql-core"
// import { AnyPgTable, PgDatabase } from "drizzle-orm/pg-core"
// import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
// import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
// import { DefaultSchema as PgSchema } from "./pg"
import { DefaultSchema as MySqlSchema } from "./mysql"
// import { DefaultSchema as SQLiteSchema } from "./sqlite"
// import { DefaultSchema as PlanetScaleSchema } from "./planetscale"

export type AnyMySqlDatabase = MySqlDatabase<any, any>
// export type AnyPgDatabase = PgDatabase<any, any, any>
// export type AnySQLiteDatabase = BaseSQLiteDatabase<any, any>
// export type AnyPlanetScaleDatabase = PlanetScaleDatabase<any>

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, AnyMySqlTable>
  // pg: PgSchema & Record<string, AnyPgTable>
  // sqlite: SQLiteSchema & Record<string, AnySQLiteTable>
  // planetscale: PlanetScaleSchema & Record<string, AnyMySqlTable>
}

export type SqlFlavorOptions = AnyMySqlDatabase
// | AnyPgDatabase
// | AnySQLiteDatabase
// | AnyPlanetScaleDatabase

export type ClientFlavors<Flavor> =
  // Flavor extends AnyPlanetScaleDatabase
  // ? MinimumSchema["planetscale"]
  // :
  Flavor extends AnyMySqlDatabase
  ? MinimumSchema["mysql"]
  // : Flavor extends AnyPgDatabase
  // ? MinimumSchema["pg"]
  // : Flavor extends AnySQLiteDatabase
  // ? MinimumSchema["sqlite"]
  : never

export function isMySqlDatabase(db: any): db is MySqlDatabase<any, any, MySqlSchema, any> {
  return db instanceof MySqlDatabase<any, any, MySqlSchema, any>
}

// export function isPgDatabase(db: any): db is PgDatabase<any, PgSchema, any> {
//   return db instanceof PgDatabase<any, PgSchema, any>
// }

// export function isSQLiteDatabase(db: any): db is BaseSQLiteDatabase<any, SQLiteSchema, any> {
//   return db instanceof BaseSQLiteDatabase<any, SQLiteSchema, any>
// }

// export function isPlanetScaleDatabase(db: any): db is PlanetScaleDatabase<any> {
//   // PlanetScaleDatabase is a type (not a class) so we can't use instanceof
//   return db
// }