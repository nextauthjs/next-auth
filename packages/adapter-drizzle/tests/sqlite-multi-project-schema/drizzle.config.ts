import type { Config } from "drizzle-kit"

export default {
  schema: "./tests/sqlite/schema.ts",
  out: "./tests/sqlite/.drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite",
  },
} satisfies Config
