import type { Config } from "drizzle-kit";

export default {
  schema: "./src/mysql/index.ts",
  out: "./src/mysql/.drizzle",
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
} satisfies Config;