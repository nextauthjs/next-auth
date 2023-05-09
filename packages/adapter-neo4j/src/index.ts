/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://neo4j.com/docs/">Neo4j</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://neo4j.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/neo4j.png" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/neo4j-adapter neo4j-driver
 * ```
 *
 * @module @next-auth/neo4j-adapter
 */
import type { Session } from "neo4j-driver"
import type { Adapter } from "next-auth/adapters"
import { v4 as uuid } from "uuid"

import { client, format } from "./utils"
export { format }

/** This is the interface of the Neo4j adapter options. The Neo4j adapter takes a {@link https://neo4j.com/docs/bolt/current/driver-api/#driver-session Neo4j session} as its only argument. */
export interface Neo4jOptions extends Session {}

/**
 * ## Setup
 *
 * Add this adapter to your `pages/api/[...nextauth].js` Auth.js configuration object.
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import neo4j from "neo4j-driver"
 * import { Neo4jAdapter } from "@next-auth/neo4j-adapter"
 *
 * const driver = neo4j.driver(
 *   "bolt://localhost",
 *   neo4j.auth.basic("neo4j", "password")
 * )
 *
 * const neo4jSession = driver.session()
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-options
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/oauth-builtin
 *   providers: [],
 *   adapter: Neo4jAdapter(neo4jSession),
 *   ...
 * })
 * ```
 * ## Advanced usage
 *
 * ### Schema
 *
 * #### Node labels
 *
 * The following node labels are used.
 *
 * - User
 * - Account
 * - Session
 * - VerificationToken
 *
 * #### Relationships
 *
 * The following relationships and relationship labels are used.
 *
 * - (:User)-[:HAS_ACCOUNT]->(:Account)
 * - (:User)-[:HAS_SESSION]->(:Session)
 *
 * #### Properties
 *
 * This schema is adapted for use in Neo4J and is based upon our main [models](https://authjs.dev/reference/adapters#models). Please check there for the node properties. Relationships have no properties.
 *
 * #### Indexes
 *
 * Optimum indexes will vary on your edition of Neo4j i.e. community or enterprise, and in case you have your own additional data on the nodes. Below are basic suggested indexes.
 *
 * 1. For **both** Community Edition & Enterprise Edition create constraints and indexes
 *
 * ```cypher
 *
 * CREATE CONSTRAINT user_id_constraint IF NOT EXISTS
 * ON (u:User) ASSERT u.id IS UNIQUE;
 *
 * CREATE INDEX user_id_index IF NOT EXISTS
 * FOR (u:User) ON (u.id);
 *
 * CREATE INDEX user_email_index IF NOT EXISTS
 * FOR (u:User) ON (u.email);
 *
 * CREATE CONSTRAINT session_session_token_constraint IF NOT EXISTS
 * ON (s:Session) ASSERT s.sessionToken IS UNIQUE;
 *
 * CREATE INDEX session_session_token_index IF NOT EXISTS
 * FOR (s:Session) ON (s.sessionToken);
 * ```
 *
 * 2.a. For Community Edition **only** create single-property indexes
 *
 * ```cypher
 * CREATE INDEX account_provider_index IF NOT EXISTS
 * FOR (a:Account) ON (a.provider);
 *
 * CREATE INDEX account_provider_account_id_index IF NOT EXISTS
 * FOR (a:Account) ON (a.providerAccountId);
 *
 * CREATE INDEX verification_token_identifier_index IF NOT EXISTS
 * FOR (v:VerificationToken) ON (v.identifier);
 *
 * CREATE INDEX verification_token_token_index IF NOT EXISTS
 * FOR (v:VerificationToken) ON (v.token);
 * ```
 *
 * 2.b. For Enterprise Edition **only** create composite node key constraints and indexes
 *
 * ```cypher
 * CREATE CONSTRAINT account_provider_composite_constraint IF NOT EXISTS
 * ON (a:Account) ASSERT (a.provider, a.providerAccountId) IS NODE KEY;
 *
 * CREATE INDEX account_provider_composite_index IF NOT EXISTS
 * FOR (a:Account) ON (a.provider, a.providerAccountId);
 *
 * CREATE CONSTRAINT verification_token_composite_constraint IF NOT EXISTS
 * ON (v:VerificationToken) ASSERT (v.identifier, v.token) IS NODE KEY;
 *
 * CREATE INDEX verification_token_composite_index IF NOT EXISTS
 * FOR (v:VerificationToken) ON (v.identifier, v.token);
 * ```
 */
export function Neo4jAdapter(session: Session): Adapter {
  const { read, write } = client(session)

  return {
    async createUser(data) {
      const user: any = { id: uuid(), ...data }
      await write(`CREATE (u:User $data)`, user)
      return user
    },

    async getUser(id) {
      return await read(`MATCH (u:User { id: $id }) RETURN u{.*}`, {
        id,
      })
    },

    async getUserByEmail(email) {
      return await read(`MATCH (u:User { email: $email }) RETURN u{.*}`, {
        email,
      })
    },

    async getUserByAccount(provider_providerAccountId) {
      return await read(
        `MATCH (u:User)-[:HAS_ACCOUNT]->(a:Account {
           provider: $provider,
           providerAccountId: $providerAccountId
         })
         RETURN u{.*}`,
        provider_providerAccountId
      )
    },

    async updateUser(data) {
      return (
        await write(
          `MATCH (u:User { id: $data.id })
           SET u += $data
           RETURN u{.*}`,
          data
        )
      ).u
    },

    async deleteUser(id) {
      return await write(
        `MATCH (u:User { id: $data.id })
         WITH u, u{.*} AS properties
         DETACH DELETE u
         RETURN properties`,
        { id }
      )
    },

    async linkAccount(data) {
      const { userId, ...a } = data
      await write(
        `MATCH (u:User { id: $data.userId })
         MERGE (a:Account {
           providerAccountId: $data.a.providerAccountId,
           provider: $data.a.provider
         }) 
         SET a += $data.a
         MERGE (u)-[:HAS_ACCOUNT]->(a)`,
        { userId, a }
      )
      return data
    },

    async unlinkAccount(provider_providerAccountId) {
      return await write(
        `MATCH (u:User)-[:HAS_ACCOUNT]->(a:Account {
           providerAccountId: $data.providerAccountId,
           provider: $data.provider
         })
         WITH u, a, properties(a) AS properties
         DETACH DELETE a
         RETURN properties { .*, userId: u.id }`,
        provider_providerAccountId
      )
    },

    async createSession(data) {
      const { userId, ...s } = format.to(data)
      await write(
        `MATCH (u:User { id: $data.userId })
         CREATE (s:Session)
         SET s = $data.s
         CREATE (u)-[:HAS_SESSION]->(s)`,
        { userId, s }
      )
      return data
    },

    async getSessionAndUser(sessionToken) {
      const result = await write(
        `OPTIONAL MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $data.sessionToken })
         WHERE s.expires <= datetime($data.now)
         DETACH DELETE s
         WITH count(s) AS c
         MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $data.sessionToken })
         RETURN s { .*, userId: u.id } AS session, u{.*} AS user`,
        { sessionToken, now: new Date().toISOString() }
      )

      if (!result?.session || !result?.user) return null

      return {
        session: format.from<any>(result.session),
        user: format.from<any>(result.user),
      }
    },

    async updateSession(data) {
      return await write(
        `MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $data.sessionToken })
         SET s += $data
         RETURN s { .*, userId: u.id }`,
        data
      )
    },

    async deleteSession(sessionToken) {
      return await write(
        `MATCH (u:User)-[:HAS_SESSION]->(s:Session { sessionToken: $data.sessionToken })
         WITH u, s, properties(s) AS properties
         DETACH DELETE s
         RETURN properties { .*, userId: u.id }`,
        { sessionToken }
      )
    },

    async createVerificationToken(data) {
      await write(
        `MERGE (v:VerificationToken {
           identifier: $data.identifier,
           token: $data.token
         })
         SET v = $data`,
        data
      )
      return data
    },

    async useVerificationToken(data) {
      const result = await write(
        `MATCH (v:VerificationToken {
           identifier: $data.identifier,
           token: $data.token
         })
         WITH v, properties(v) as properties
         DETACH DELETE v
         RETURN properties`,
        data
      )
      return format.from<any>(result?.properties)
    },
  }
}
