import { migrate } from "drizzle-orm/postgres-js/migrator"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const migrator = async () => {
  const connectionString =
    "postgres://nextauth:nextauth@127.0.0.1:5432/nextauth"
  const sql = postgres(connectionString, { max: 1 })

  await migrate(drizzle(sql), { migrationsFolder: "./test/pg/.drizzle" })
}

migrator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
