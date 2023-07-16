import type { Config } from "drizzle-kit"

export default {
  schema: "./tests/mysql/schema.ts",
  out: "./tests/mysql/.drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  },
} satisfies Config
