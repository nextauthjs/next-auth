import { runBasicTests } from "utils/adapter"
import SqlServerAdapter, { mapExpiresAt } from "../src"
import sql from "mssql"

const POOL_SIZE = 10

const client = new sql.ConnectionPool({
  server: "localhost",
  database: "adapter-sqlserver-test",
  user: "sa",
  password: "Authjs!password",
  pool: {
    max: POOL_SIZE,
    min: POOL_SIZE,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
})

runBasicTests({
  adapter: SqlServerAdapter(client),
  testWebAuthnMethods: true,
  db: {
    connect: async () => {
      await client.connect()
    },
    disconnect: async () => {
      await client.close()
    },
    user: async (id: string) => {
      const sql = `select * from users where id = @id`
      const result = await client.request().input("id", id).query(sql)
      return result.recordset[0] ?? null
    },
    account: async (account) => {
      const sql = `select * from accounts where providerAccountId = @account_id`

      const result = await client
        .request()
        .input("account_id", account.providerAccountId)
        .query(sql)
      return result.recordset[0] ? mapExpiresAt(result.recordset[0]) : null
    },
    session: async (sessionToken) => {
      const result = await client
        .request()
        .input("session_token", sessionToken)
        .query(`select * from sessions where sessionToken = @session_token`)

      return result.recordset[0] ?? null
    },
    verificationToken: async (identifier_token) => {
      const { identifier, token } = identifier_token
      const result = await client
        .request()
        .input("identifier", identifier)
        .input("token", token)
        .query(
          "select * from verification_tokens where identifier = @identifier and token = @token"
        )
      return result.recordset[0] ?? null
    },
    authenticator: async (credentialId) => {
      const result = await client
        .request()
        .input("credentialId", credentialId)
        .query(
          "select * from authenticators where credentialID = @credentialId "
        )
      return result.recordset[0] ?? null
    },
  },
})
