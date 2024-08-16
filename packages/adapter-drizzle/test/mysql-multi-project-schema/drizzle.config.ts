import type { Config } from "drizzle-kit"

export default {
  schema: "./test/mysql-multi-project-schema/schema.ts",
  out: "./test/mysql-multi-project-schema/.drizzle",
  dialect: "mysql",
  dbCredentials: {
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  },
} satisfies Config
