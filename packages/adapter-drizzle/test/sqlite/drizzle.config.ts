import type { Config } from "drizzle-kit"

export default {
  schema: "./test/sqlite/schema.ts",
  out: "./test/sqlite/.drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./db.sqlite",
  },
} satisfies Config
