import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { db } from "./schema.ts"

try {
  migrate(db, {
    migrationsFolder: "./test/sqlite-multi-project-schema/.drizzle",
  })
  process.exit(0)
} catch (e) {
  process.exit(1)
}
