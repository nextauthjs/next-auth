import { rakeDb } from "rake-db"
import { config } from "./config"

export const change = rakeDb(
  {
    databaseURL: config.databaseUrl,
  },
  {
    log: true,
    migrationsPath: "../migrations",
    import: (path) => import(path),
  }
)
