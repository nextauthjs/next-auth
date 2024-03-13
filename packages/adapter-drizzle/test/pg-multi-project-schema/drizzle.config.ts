import type { Config } from "drizzle-kit"

export default {
  schema: "./test/pg/schema.ts",
  out: "./test/pg/.drizzle",
  dbCredentials: {
    database: "nextauth",
    host: "nextauth",
    user: "nextauth",
    password: "nextauth",
    port: 5432,
  },
} satisfies Config
