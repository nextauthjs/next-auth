import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import type { QueryResultHKT as MySQLQueryResultHKT, PreparedQueryHKTBase } from "drizzle-orm/mysql-core"
import type { QueryResultHKT as PostgresQueryResultHKT } from "drizzle-orm/pg-core"
import { DefaultSQLiteSchema } from "./sqlite"
import { DefaultPostgresSchema } from "./pg"
import { DefaultMySqlSchema } from "./mysql"

type AnyPostgresDatabase = PgDatabase<PostgresQueryResultHKT, any>
type AnyMySqlDatabase = MySqlDatabase<MySQLQueryResultHKT, PreparedQueryHKTBase, any>
type AnySQLiteDatabase = BaseSQLiteDatabase<'sync' | 'async', any, any>

export type SqlFlavorOptions = AnyPostgresDatabase | AnyMySqlDatabase | AnySQLiteDatabase

export type DefaultSchema<Flavor> = Flavor extends AnyMySqlDatabase ? DefaultMySqlSchema : Flavor extends AnyPostgresDatabase ? DefaultPostgresSchema : Flavor extends AnySQLiteDatabase ? DefaultSQLiteSchema : never
