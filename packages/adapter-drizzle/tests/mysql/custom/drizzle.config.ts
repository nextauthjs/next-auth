import type { Config } from "drizzle-kit";

export default {
  schema: "./tests/mysql/custom/index.ts",
  out: "./test/mysql/custom/.drizzle",
  "driver": "mysql2",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  }
} satisfies Config;