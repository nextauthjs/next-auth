import type { Config } from "drizzle-kit"

export default {
  schema: "./test/pg-multi-project-schema/schema.ts",
  out: "./test/pg-multi-project-schema/.drizzle",
  driver: "pg",
  dbCredentials: {
    database: "nextauth",
    host: "nextauth",
    user: "nextauth",
    password: "nextauth",
    port: 5432,
  },
} satisfies Config
