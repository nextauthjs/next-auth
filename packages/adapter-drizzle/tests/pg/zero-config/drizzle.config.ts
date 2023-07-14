import type { Config } from "drizzle-kit";

export default {
  schema: "./tests/pg/zero-config/schema.ts",
  out: "./tests/pg/zero-config/.drizzle",
  dbCredentials: {
    database: "nextauth",
    host: "nextauth",
    user: "nextauth",
    password: "nextauth",
    port: 5432,
  }
} satisfies Config;