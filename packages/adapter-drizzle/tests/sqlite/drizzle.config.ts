import type { Config } from "drizzle-kit";

export default {
  schema: "./src/sqlite/index.ts",
  out: "./src/sqlite/.drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite"
  }
} satisfies Config;