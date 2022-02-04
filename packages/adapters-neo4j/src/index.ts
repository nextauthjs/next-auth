import type { Session } from "neo4j-driver"
import type { Adapter } from "next-auth/adapters"
import { v4 as uuid } from "uuid"

import { client, format } from "./utils"
export { format }

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

    // @ts-expect-error Property 'id' is missing in type
    // We never use `session.id` anywhere in the core, so this is fine.
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
