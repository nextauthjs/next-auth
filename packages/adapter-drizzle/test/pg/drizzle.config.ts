import type { Config } from "drizzle-kit"

export default {
  schema: "./test/pg/schema.ts",
  out: "./test/pg/.drizzle",
  dialect: "postgresql",
  dbCredentials: {
    database: "nextauth",
    host: "127.0.0.1",
    user: "nextauth",
    password: "nextauth",
    port: 5432,
    ssl: false,
  },
} satisfies Config
