import type { Config } from "drizzle-kit";

export default {

  schema: "./tests/sqlite/zero-config/schema.ts",
  out: "./tests/sqlite/zero-config/.drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite"
  }
} satisfies Config;