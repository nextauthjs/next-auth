import { DrizzleAdapterPg } from "@next-auth/drizzle-adapter-pg"
import { DrizzleAdapterMySQL } from "@next-auth/drizzle-adapter-mysql"
import { DrizzleAdapterSQLite } from "@next-auth/drizzle-adapter-sqlite"
import { Adapter } from "next-auth/adapters"

export function DrizzleAdapter(db: any): Adapter {
  if (isMySqlDatabase(db)) return DrizzleAdapterMySQL(db)
  else if (isPgDatabase(db)) return DrizzleAdapterPg(db)
  else if (isSQLiteDatabase(db)) return DrizzleAdapterSQLite(db)
  else throw new Error("Unsupported database")
}
import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"

export function isMySqlDatabase(db: any): db is MySqlDatabase<any, any> {
  return db instanceof MySqlDatabase<any, any>
}

export function isPgDatabase(db: any): db is PgDatabase<any> {
  return db instanceof PgDatabase<any>
}

export function isSQLiteDatabase(db: any): db is BaseSQLiteDatabase<any, any> {
  return db instanceof BaseSQLiteDatabase<any, any>
}