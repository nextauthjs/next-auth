/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>An official <a href="https://developers.cloudflare.com/d1/">Cloudflare D1</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://developers.cloudflare.com/d1/">
 *   <img style={{display: "block"}} src="/img/adapters/d1.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Warning
 * This adapter is not developed or maintained by Cloudflare and they haven't declared the D1 api stable.  The author will make an effort to keep this adapter up to date.
 * The adapter is compatible with the D1 api as of March 22, 2023.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/d1-adapter
 * ```
 *
 * @module @auth/d1-adapter
 */

import type { D1Database as WorkerDatabase } from "@cloudflare/workers-types"
import type { D1Database as MiniflareD1Database } from "@miniflare/d1"
import {
  type Adapter,
  type AdapterSession,
  type AdapterUser,
  type AdapterAccount,
  type VerificationToken as AdapterVerificationToken,
  isDate,
} from "@auth/core/adapters"

export { up } from "./migrations.js"

/**
 * @type @cloudflare/workers-types.D1Database | @miniflare/d1.D1Database
 */
export type D1Database = WorkerDatabase | MiniflareD1Database

export const CREATE_USER_SQL = `INSERT INTO users (id, name, email, emailVerified, image) VALUES (?, ?, ?, ?, ?)`
export const GET_USER_BY_ID_SQL = `SELECT * FROM users WHERE id = ?`
export const GET_USER_BY_EMAIL_SQL = `SELECT * FROM users WHERE email = ?`
export const GET_USER_BY_ACCOUNTL_SQL = `
  SELECT u.*
  FROM users u JOIN accounts a ON a.userId = u.id
  WHERE a.providerAccountId = ? AND a.provider = ?`
export const UPDATE_USER_BY_ID_SQL = `
  UPDATE users 
  SET name = ?, email = ?, emailVerified = ?, image = ?
  WHERE id = ? `
export const DELETE_USER_SQL = `DELETE FROM users WHERE id = ?`

// SESSION
export const CREATE_SESSION_SQL =
  "INSERT INTO sessions (id, sessionToken, userId, expires) VALUES (?,?,?,?)"
export const GET_SESSION_BY_TOKEN_SQL = `
  SELECT id, sessionToken, userId, expires
  FROM sessions
  WHERE sessionToken = ?`
export const UPDATE_SESSION_BY_SESSION_TOKEN_SQL = `UPDATE sessions SET expires = ? WHERE sessionToken = ?`
export const DELETE_SESSION_SQL = `DELETE FROM sessions WHERE sessionToken = ?`
export const DELETE_SESSION_BY_USER_ID_SQL = `DELETE FROM sessions WHERE userId = ?`

// ACCOUNT
export const CREATE_ACCOUNT_SQL = `
  INSERT INTO accounts (
    id, userId, type, provider, 
    providerAccountId, refresh_token, access_token, 
    expires_at, token_type, scope, id_token, session_state,
    oauth_token, oauth_token_secret
  ) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const GET_ACCOUNT_BY_ID_SQL = `SELECT * FROM accounts WHERE id = ? `
export const GET_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `SELECT * FROM accounts WHERE provider = ? AND providerAccountId = ?`
export const DELETE_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL = `DELETE FROM accounts WHERE provider = ? AND providerAccountId = ?`
export const DELETE_ACCOUNT_BY_USER_ID_SQL = `DELETE FROM accounts WHERE userId = ?`

// VERIFICATION_TOKEN
export const GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL = `SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?`
export const CREATE_VERIFICATION_TOKEN_SQL = `INSERT INTO verification_tokens (identifier, expires, token) VALUES (?,?,?)`
export const DELETE_VERIFICATION_TOKEN_SQL = `DELETE FROM verification_tokens WHERE identifier = ? and token = ?`

function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete obj[key]
    }

    if (isDate(value)) {
      obj[key] = new Date(value)
    }
  }

  return obj as T
}

// D1 doesnt like undefined, it wants null when calling bind
function cleanBindings(bindings: any[]) {
  return bindings.map((e) => (e === undefined ? null : e))
}

export async function createRecord<RecordType>(
  db: D1Database,
  CREATE_SQL: string,
  bindings: any[],
  GET_SQL: string,
  getBindings: any[]
) {
  try {
    bindings = cleanBindings(bindings)
    await db
      .prepare(CREATE_SQL)
      .bind(...bindings)
      .run()
    return await getRecord<RecordType>(db, GET_SQL, getBindings)
  } catch (e: any) {
    console.error(e.message, e.cause?.message)
    throw e
  }
}

export async function getRecord<RecordType>(
  db: D1Database,
  SQL: string,
  bindings: any[]
): Promise<RecordType | null> {
  try {
    bindings = cleanBindings(bindings)
    const res: any = await db
      .prepare(SQL)
      .bind(...bindings)
      .first()
    if (res) {
      return format<RecordType>(res)
    } else {
      return null
    }
  } catch (e: any) {
    console.error(e.message, e.cause?.message)
    throw e
  }
}

export async function updateRecord(
  db: D1Database,
  SQL: string,
  bindings: any[]
) {
  try {
    bindings = cleanBindings(bindings)
    return await db
      .prepare(SQL)
      .bind(...bindings)
      .run()
  } catch (e: any) {
    console.error(e.message, e.cause?.message)
    throw e
  }
}

export async function deleteRecord(
  db: D1Database,
  SQL: string,
  bindings: any[]
) {
  // eslint-disable-next-line no-useless-catch
  try {
    bindings = cleanBindings(bindings)
    await db
      .prepare(SQL)
      .bind(...bindings)
      .run()
  } catch (e: any) {
    console.error(e.message, e.cause?.message)
    throw e
  }
}

export function D1Adapter(db: D1Database): Adapter {
  // we need to run migrations if we dont have the right tables

  return {
    async createUser(user) {
      const id: string = crypto.randomUUID()
      const createBindings = [
        id,
        user.name,
        user.email,
        user.emailVerified?.toISOString(),
        user.image,
      ]
      const getBindings = [id]

      const newUser = await createRecord<AdapterUser>(
        db,
        CREATE_USER_SQL,
        createBindings,
        GET_USER_BY_ID_SQL,
        getBindings
      )
      if (newUser) return newUser
      throw new Error("Error creating user: Cannot get user after creation.")
    },
    async getUser(id) {
      return await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [id])
    },
    async getUserByEmail(email) {
      return await getRecord<AdapterUser>(db, GET_USER_BY_EMAIL_SQL, [email])
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return await getRecord<AdapterUser>(db, GET_USER_BY_ACCOUNTL_SQL, [
        providerAccountId,
        provider,
      ])
    },
    async updateUser(user) {
      const params = await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [
        user.id,
      ])
      if (params) {
        // copy any properties not in the update into the existing one and use that for bind params
        // covers the scenario where the user arg doesnt have all of the current users properties
        Object.assign(params, user)
        const res = await updateRecord(db, UPDATE_USER_BY_ID_SQL, [
          params.name,
          params.email,
          params.emailVerified?.toISOString(),
          params.image,
          params.id,
        ])
        if (res.success) {
          const user = await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [
            params.id,
          ])
          if (user) return user
          throw new Error(
            "Error updating user: Cannot get user after updating."
          )
        }
      }
      throw new Error("Error updating user: Failed to run the update SQL.")
    },
    async deleteUser(userId) {
      // miniflare doesn't support batch operations or multiline sql statements
      await deleteRecord(db, DELETE_ACCOUNT_BY_USER_ID_SQL, [userId])
      await deleteRecord(db, DELETE_SESSION_BY_USER_ID_SQL, [userId])
      await deleteRecord(db, DELETE_USER_SQL, [userId])
      return null
    },
    async linkAccount(a) {
      // convert user_id to userId and provider_account_id to providerAccountId
      const id = crypto.randomUUID()
      const createBindings = [
        id,
        a.userId,
        a.type,
        a.provider,
        a.providerAccountId,
        a.refresh_token,
        a.access_token,
        a.expires_at,
        a.token_type,
        a.scope,
        a.id_token,
        a.session_state,
        a.oauth_token ?? null,
        a.oauth_token_secret ?? null,
      ]
      const getBindings = [id]
      return await createRecord<AdapterAccount>(
        db,
        CREATE_ACCOUNT_SQL,
        createBindings,
        GET_ACCOUNT_BY_ID_SQL,
        getBindings
      )
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await deleteRecord(
        db,
        DELETE_ACCOUNT_BY_PROVIDER_AND_PROVIDER_ACCOUNT_ID_SQL,
        [provider, providerAccountId]
      )
    },
    async createSession({ sessionToken, userId, expires }) {
      const id = crypto.randomUUID()
      const createBindings = [id, sessionToken, userId, expires.toISOString()]
      const getBindings = [sessionToken]
      const session = await createRecord<AdapterSession>(
        db,
        CREATE_SESSION_SQL,
        createBindings,
        GET_SESSION_BY_TOKEN_SQL,
        getBindings
      )
      if (session) return session
      throw new Error(`Couldn't create session`)
    },
    async getSessionAndUser(sessionToken) {
      const session: any = await getRecord<AdapterSession>(
        db,
        GET_SESSION_BY_TOKEN_SQL,
        [sessionToken]
      )
      if (session === null) return null

      const user = await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [
        session.userId,
      ])
      if (user === null) return null

      return { session, user }
    },
    async updateSession({ sessionToken, expires }) {
      if (expires === undefined) {
        await deleteRecord(db, DELETE_SESSION_SQL, [sessionToken])
        return null
      }
      const session = await getRecord<AdapterSession>(
        db,
        GET_SESSION_BY_TOKEN_SQL,
        [sessionToken]
      )
      if (!session) return null
      session.expires = expires
      await updateRecord(db, UPDATE_SESSION_BY_SESSION_TOKEN_SQL, [
        expires?.toISOString(),
        sessionToken,
      ])
      return await db
        .prepare(UPDATE_SESSION_BY_SESSION_TOKEN_SQL)
        .bind(expires?.toISOString(), sessionToken)
        .first()
    },
    async deleteSession(sessionToken) {
      await deleteRecord(db, DELETE_SESSION_SQL, [sessionToken])
      return null
    },
    async createVerificationToken({ identifier, expires, token }) {
      return await createRecord(
        db,
        CREATE_VERIFICATION_TOKEN_SQL,
        [identifier, expires.toISOString(), token],
        GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL,
        [identifier, token]
      )
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await getRecord<AdapterVerificationToken>(
        db,
        GET_VERIFICATION_TOKEN_BY_IDENTIFIER_AND_TOKEN_SQL,
        [identifier, token]
      )
      if (!verificationToken) return null
      await deleteRecord(db, DELETE_VERIFICATION_TOKEN_SQL, [identifier, token])
      return verificationToken
    },
  }
}
