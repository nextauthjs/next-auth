import type { Config } from "drizzle-kit"

export default {
  schema: "./test/sqlite-multi-project-schema/schema.ts",
  out: "./test/sqlite-multi-project-schema/.drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./db.sqlite",
  },
} satisfies Config
