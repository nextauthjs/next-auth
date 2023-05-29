import { AnyMySqlTable, MySqlDatabase } from "drizzle-orm/mysql-core"
import { AnyPgTable, PgDatabase } from "drizzle-orm/pg-core"
import { AnySQLiteTable, BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless"
import { Schema as PgSchema } from "./pg/schema"
import { Schema as MySqlSchema } from "./mysql/schema"
import { Schema as SQLiteSchema } from "./sqlite/schema"
import { Schema as PlanetScaleSchema } from "./planetscale/schema"

export type AdapterFlavors = "mysql" | "pg" | "sqlite" | "planetscale"

export type ClientFlavors<T> = T extends AdapterFlavors
  ? T extends "mysql"
    ? MySqlDatabase<any, any>
    : T extends "pg"
    ? PgDatabase<any, PgSchema, any>
    : T extends "sqlite"
    ? BaseSQLiteDatabase<any, any>
    : T extends "planetscale"
    ? PlanetScaleDatabase<any>
    : never
  : never

export interface MinimumSchema {
  mysql: MySqlSchema & Record<string, AnyMySqlTable>
  pg: PgSchema & Record<string, AnyPgTable>
  sqlite: SQLiteSchema & Record<string, AnySQLiteTable>
  planetscale: PlanetScaleSchema & Record<string, AnyMySqlTable>
}
