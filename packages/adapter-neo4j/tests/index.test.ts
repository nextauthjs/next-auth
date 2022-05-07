import * as neo4j from "neo4j-driver"
import { runBasicTests } from "@next-auth/adapter-test"
import statements from "./resources/statements"

import { Neo4jAdapter, format } from "../src"

const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "password")
)

const neo4jSession = driver.session()

runBasicTests({
  adapter: Neo4jAdapter(neo4jSession),
  db: {
    async connect() {
      for await (const statement of statements.split(";")) {
        if (!statement.length) return
        await neo4jSession.writeTransaction((tx) => tx.run(statement))
      }
    },
    async disconnect() {
      await neo4jSession.writeTransaction((tx) =>
        tx.run(
          `MATCH (n)
           DETACH DELETE n
           RETURN count(n)`
        )
      )
      await neo4jSession.close()
      await driver.close()
    },
    async user(id) {
      const result = await neo4jSession.readTransaction((tx) =>
        tx.run(`MATCH (u:User) RETURN u`, { id })
      )
      return format.from(result?.records[0]?.get("u")?.properties)
    },

    async session(sessionToken: any) {
      const result = await neo4jSession.readTransaction((tx) =>
        tx.run(
          `MATCH (u:User)-[:HAS_SESSION]->(s:Session)
           RETURN s, u.id AS userId`,
          { sessionToken }
        )
      )
      const session = result?.records[0]?.get("s")?.properties
      const userId = result?.records[0]?.get("userId")

      if (!session || session.userId || !userId) return null

      return { ...format.from(session), userId }
    },

    async account(provider_providerAccountId) {
      const result = await neo4jSession.readTransaction((tx) =>
        tx.run(
          `MATCH (u:User)-[:HAS_ACCOUNT]->(a:Account)
           RETURN a, u.id AS userId`,
          provider_providerAccountId
        )
      )

      const account = result?.records[0]?.get("a")?.properties
      const userId = result?.records[0]?.get("userId")

      if (!account || account.userId || !userId) return null

      return { ...format.from(account), userId }
    },

    async verificationToken(identifier_token) {
      const result = await neo4jSession.readTransaction((tx) =>
        tx.run(
          `MATCH (v:VerificationToken)
           RETURN v`,
          identifier_token
        )
      )

      return format.from(result?.records[0]?.get("v")?.properties)
    },
  },
})
