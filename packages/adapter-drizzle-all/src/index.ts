import { PgAdapter } from "./pg"
import { MySqlAdapter } from "./mysql"
import { SQLiteAdapter } from "./sqlite"
import { Adapter } from "next-auth/adapters"

export function DrizzleAdapter(db: any): Adapter {
  if (isMySqlDatabase(db)) return MySqlAdapter(db)
  else if (isPgDatabase(db)) return PgAdapter(db)
  else if (isSQLiteDatabase(db)) return SQLiteAdapter(db)
  else throw new Error("Unsupported database")
}
import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"

export function isMySqlDatabase(db: any): db is MySqlDatabase<any, any> {
  return db instanceof MySqlDatabase<any, any>
}

export function isPgDatabase(db: any): db is PgDatabase<any, any> {
  return db instanceof PgDatabase<any, any>
}

export function isSQLiteDatabase(db: any): db is BaseSQLiteDatabase<any, any> {
  return db instanceof BaseSQLiteDatabase<any, any>
}