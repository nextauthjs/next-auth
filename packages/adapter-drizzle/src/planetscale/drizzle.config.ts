import type { Config } from "drizzle-kit";

export default {
  schema: "./src/planetscale/index.ts",
  out: "./src/planetscale/.drizzle",
} satisfies Config;