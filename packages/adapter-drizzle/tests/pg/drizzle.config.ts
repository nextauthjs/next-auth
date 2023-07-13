import type { Config } from "drizzle-kit";

export default {
  schema: "./src/pg/index.ts",
  out: "./src/pg/.drizzle",
} satisfies Config;