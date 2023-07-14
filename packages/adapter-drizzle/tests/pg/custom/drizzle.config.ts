import type { Config } from "drizzle-kit";

export default {
  schema: "./tests/sqlite/custom/schema.ts",
  out: "./test/sqlite/custom/.drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite"
  }
} satisfies Config;