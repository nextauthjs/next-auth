import { migrate } from "drizzle-orm/postgres-js/migrator"
import { db } from "./schema"

const migrator = async () => {
  await migrate(db, { migrationsFolder: "./test/pg/.drizzle" })
}

migrator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
