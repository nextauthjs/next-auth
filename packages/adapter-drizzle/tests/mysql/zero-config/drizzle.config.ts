import type { Config } from "drizzle-kit";

export default {

  schema: "./tests/mysql/zero-config/schema.ts",
  out: "./tests/mysql/zero-config/.drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  }
} satisfies Config;