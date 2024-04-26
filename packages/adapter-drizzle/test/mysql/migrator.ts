import { migrate } from "drizzle-orm/mysql2/migrator"
import { db } from "./schema.ts"

const migrator = async () => {
  await migrate(db, { migrationsFolder: "./test/mysql/.drizzle" })
}

migrator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
