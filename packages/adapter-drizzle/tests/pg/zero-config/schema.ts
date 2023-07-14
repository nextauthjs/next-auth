import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { users, accounts, sessions, verificationTokens } from "../../../src/pg";

const connectionString = "postgres://nextauth:nextauth@localhost:5432/next-auth"
const sql = postgres(connectionString, { max: 1 })

export const db = drizzle(sql);
export { users, accounts, sessions, verificationTokens }

const migrator = async () => {
  await migrate(db, { migrationsFolder: "./tests/pg/zero-config/.drizzle" });
}

migrator()