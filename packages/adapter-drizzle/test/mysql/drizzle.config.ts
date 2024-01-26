import type { Config } from "drizzle-kit"

export default {
  schema: "./test/mysql/schema.ts",
  out: "./test/mysql/.drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  },
} satisfies Config
