import type { Config } from "drizzle-kit"

export default {
  schema: "./tests/pg/schema.ts",
  out: "./tests/pg/.drizzle",
  dbCredentials: {
    database: "nextauth",
    host: "nextauth",
    user: "nextauth",
    password: "nextauth",
    port: 5432,
  },
} satisfies Config
