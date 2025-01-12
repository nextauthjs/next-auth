import type {
  MySqlQueryResultHKT,
  PreparedQueryHKTBase,
} from "drizzle-orm/mysql-core"
import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { DefaultMySqlSchema } from "./mysql.js"
import { DefaultPostgresSchema } from "./pg.js"
import { DefaultSQLiteSchema } from "./sqlite.js"

type AnyPostgresDatabase = PgDatabase<PgQueryResultHKT, any>
type AnyMySqlDatabase = MySqlDatabase<
  MySqlQueryResultHKT,
  PreparedQueryHKTBase,
  any
>
type AnySQLiteDatabase = BaseSQLiteDatabase<"sync" | "async", any, any>

export type SqlFlavorOptions =
  | AnyPostgresDatabase
  | AnyMySqlDatabase
  | AnySQLiteDatabase

export type DefaultSchema<Flavor extends SqlFlavorOptions> =
  Flavor extends AnyMySqlDatabase
    ? DefaultMySqlSchema
    : Flavor extends AnyPostgresDatabase
      ? DefaultPostgresSchema
      : Flavor extends AnySQLiteDatabase
        ? DefaultSQLiteSchema
        : never
