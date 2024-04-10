import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
export {
  postgresUsersTable,
  postgresAccountsTable,
  postgresSessionsTable,
  postgresVerificationTokensTable,
} from "../../src/lib/pg"

const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString)

export const db = drizzle(sql)
