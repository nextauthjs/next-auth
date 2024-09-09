import { migrate } from "drizzle-orm/mysql2/migrator"
import { db } from "./schema"

const migrator = async () => {
  await migrate(db, {
    migrationsFolder: "./test/mysql-multi-project-schema/.drizzle",
  })
}

migrator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
