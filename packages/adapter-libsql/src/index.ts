/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://github.com/tursodatabase/libsql">libSQL</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://github.com/tursodatabase/libsql">
 *   <img style={{display: "block"}} src="/img/adapters/libsql.png" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @libsql/client @auth/libsql-adapter
 * ```
 *
 * @module @auth/libsql-adapter
 */

import {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

import type { Client } from "@libsql/client"
import { LibSQLWrapper, sqlTemplate } from "./utils"

/**
 * ## Setup
 *
 * Create a schema that includes [the minimum requirements for a `next-auth` adapter](/reference/core/adapters#models).
 *
 * ### Creating tables in database with `up` function
 * 
 * ```ts title="migration.ts"
 * import { up } from "@auth/libsql";
 * import { createClient } from "@libsql/client";
 * 
 * const client = createClient({
 *  url: "file:test.db",
 * });
 * 
 * async function migrate() {
 *   await up(client);
 * }
 * migrate();
 * ```
 * 
 * ### Creating tables manually 
 * ```sql title="schema.sql"
 * CREATE TABLE IF NOT EXISTS "account" (
 *  "userId" TEXT NOT NULL,
 *  "type" TEXT NOT NULL,
 *  "provider" TEXT NOT NULL,
 *  "providerAccountId" TEXT NOT NULL,
 *  "refresh_token" TEXT,
 *  "access_token" TEXT,
 *  "expires_at" INTEGER,
 *  "token_type" TEXT,
 *  "scope" TEXT,
 *  "id_token" TEXT,
 *  "session_state" TEXT,
 *  PRIMARY KEY("provider", "providerAccountId"),
 *  FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
 * );
 * 
 * CREATE TABLE IF NOT EXISTS "session" (
 *  "sessionToken" TEXT PRIMARY KEY NOT NULL,
 *  "userId" TEXT NOT NULL,
 *  "expires" DATETIME NOT NULL,
 *  FOREIGN KEY ("userId") REFERENCES "user"("id") ON UPDATE no action ON DELETE cascade
 * );
 * 
 * CREATE TABLE IF NOT EXISTS "user" (
 *  "id" TEXT PRIMARY KEY NOT NULL,
 *  "name" TEXT,
 *  "email" TEXT NOT NULL,
 *  "emailVerified" DATETIME,
 *  "image" text
 * );
 * 
 * CREATE TABLE IF NOT EXISTS "verification_token" (
 *  "identifier" TEXT NOT NULL,
 *  "token" TEXT NOT NULL,
 *  "expires" DATETIME NOT NULL,
 *  PRIMARY KEY("identifier", "token")
 * );
 * ```
 * 
 * ## Using
 * ```ts
 * import { LibSQLAdapter } from "@auth/libsql";
 * import { createClient } from "@libsql/client";
 * import NextAuth from "next-auth"
 * 
 * const client = createClient({
 *  url: "file:test.db",
 * });
 * 
 * export default NextAuth({
 *   adapter: LibSQLAdapter(),
 *   // ...
 * })
 *
 * ```
 */
export function LibSQLAdapter(client: Client): Adapter {
  const clientWrapper = new LibSQLWrapper(client)

  return {
    async createUser({
      email,
      emailVerified,
      image,
      name,
    }): Promise<AdapterUser> {
      const id: string = crypto.randomUUID()
      return await clientWrapper.create({
        insertStatement: sqlTemplate`INSERT INTO user (id, email, emailVerified, image, name) VALUES (${id}, ${email}, ${emailVerified}, ${image}, ${name})`,
        selectStatemetn: sqlTemplate`SELECT * FROM user WHERE id = ${id}`,
      })
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      return clientWrapper.first`SELECT * FROM user WHERE id = ${id}`
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      return clientWrapper.first`SELECT * FROM user WHERE email = ${email}`
    },

    async updateUser(partialUser): Promise<AdapterUser> {
      const userFormDb =
        await clientWrapper.first<AdapterUser>`SELECT * FROM user WHERE id = ${partialUser.id}`
      if (!userFormDb) {
        throw new Error(
          `User with id '${partialUser.id}' was not found in database!`
        )
      }

      const user = {
        ...userFormDb,
        ...partialUser,
      }

      await clientWrapper.run`UPDATE user SET name = ${user.name}, email = ${user.email}, emailVerified = ${user.emailVerified}, image = ${user.image}`
      return user
    },

    async deleteUser(id: string): Promise<void> {
      await clientWrapper.run`DELETE FROM user WHERE id = ${id}`
    },

    async createSession({
      sessionToken,
      userId,
      expires,
    }): Promise<AdapterSession> {
      return clientWrapper.create({
        insertStatement: sqlTemplate`INSERT INTO session (sessionToken, userId, expires) VALUES (${sessionToken}, ${userId}, ${expires})`,
        selectStatemetn: sqlTemplate`SELECT * FROM session WHERE sessionToken = ${sessionToken}`,
      })
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await clientWrapper.run`DELETE FROM session WHERE sessionToken = ${sessionToken}`
    },

    async updateSession(session): Promise<AdapterSession | null> {
      const sesisonFromDb =
        await clientWrapper.first<AdapterSession>`SELECT * FROM session WHERE sessionToken = ${session.sessionToken}`

      if (!sesisonFromDb) {
        throw new Error(`Sesison was not found in database!`)
      }

      const updatedSession = {
        ...sesisonFromDb,
        ...session,
      }

      await clientWrapper.run`UPDATE session SET sessionToken = ${updatedSession.sessionToken}, userId = ${updatedSession.userId}, expires = ${updatedSession.expires}`
      return updatedSession
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session =
        await clientWrapper.first<AdapterSession>`SELECT * FROM session WHERE sessionToken = ${sessionToken}`

      if (!session) {
        return null
      }

      const user =
        await clientWrapper.first<AdapterUser>`SELECT * FROM user WHERE id = ${session.userId}`
      if (!user) {
        return null
      }

      return {
        user,
        session,
      }
    },

    async getUserByAccount({
      provider,
      providerAccountId,
    }): Promise<AdapterUser | null> {
      return clientWrapper.first`SELECT U.* from user u JOIN account a ON a.userId = u.id WHERE a.providerAccountId = ${providerAccountId} AND a.provider = ${provider}`
    },

    async createVerificationToken({
      identifier,
      token,
      expires,
    }): Promise<VerificationToken | null | undefined> {
      return clientWrapper.create({
        insertStatement: sqlTemplate`INSERT INTO verification_token (identifier, token, expires) VALUES (${identifier}, ${token}, ${expires})`,
        selectStatemetn: sqlTemplate`SELECT * FROM verification_token WHERE identifier = ${identifier} AND token = ${token}`,
      })
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount | null> {
      // session_state can be an object
      const sessionStateJson =
        account.session_state === undefined
          ? undefined
          : JSON.stringify(account.session_state)

      const temp = await clientWrapper.create<
        AdapterAccount & { session_state: string }
      >({
        insertStatement: sqlTemplate`
          INSERT INTO account (
              userId,
              type,
              provider,
              providerAccountId,
              refresh_token,
              access_token,
              expires_at,
              token_type,
              scope,
              id_token,
              session_state
            ) VALUES (
              ${account.userId},
              ${account.type},
              ${account.provider},
              ${account.providerAccountId},
              ${account.refresh_token},
              ${account.access_token},
              ${account.expires_at},
              ${account.token_type},
              ${account.scope},
              ${account.id_token},
              ${sessionStateJson}
            )`,
        selectStatemetn: sqlTemplate`SELECT * FROM account WHERE provider = ${account.provider} AND providerAccountId = ${account.providerAccountId}`,
      })

      const session_state =
        temp.session_state === undefined
          ? undefined
          : JSON.parse(temp.session_state)

      return {
        ...temp,
        session_state,
      }
    },

    async useVerificationToken({
      identifier,
      token,
    }): Promise<VerificationToken | null> {
      const verificationToken =
        await clientWrapper.first<VerificationToken>`SELECT * FROM verification_token WHERE identifier = ${identifier} AND token = ${token}`
      await clientWrapper.run`DELETE FROM verification_token WHERE identifier = ${identifier} AND token = ${token}`
      return verificationToken
    },

    async unlinkAccount({
      provider,
      providerAccountId,
    }): Promise<AdapterAccount | undefined> {
      const account =
        await clientWrapper.first<AdapterAccount>`SELECT * FROM account WHERE provider = ${provider} AND providerAccountId = ${providerAccountId}`
      await clientWrapper.run`DELETE FROM account WHERE provider = ${provider} AND providerAccountId = ${providerAccountId}`
      return account ?? undefined
    },
  } as const
}

export * from "./migration"
