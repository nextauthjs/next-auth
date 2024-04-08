import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { createTables } from "../../src/lib/pg"
import { pgTableCreator } from "drizzle-orm/pg-core"

const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString, { max: 1 })

const pgTable = pgTableCreator((name) => `foobar_${name}`)

export const { users, accounts, sessions, verificationTokens } =
  createTables(pgTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(sql, {
  schema,
})
