/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://www.microsoft.com/en-us/sql-server">MS SQL Server</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://www.microsoft.com/en-us/sql-server">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/sqlseverserver.svg" width="30" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/sqlserver-adapter mssql
 * ```
 *
 * @module @auth/sqlserver-adapter
 */

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
  AdapterAuthenticator,
} from "@auth/core/adapters"
import sql from "mssql"

export function mapExpiresAt(account: any): any {
  const expires_at: number = parseInt(account.expires_at)
  return {
    ...account,
    expires_at,
  }
}

export default function TSqlAdapter(connection: sql.ConnectionPool): Adapter {
  const conn = connection

  return {
    async createUser(user) {
      const request = conn.request()
      request.input("name", sql.VarChar, user.name)
      request.input("email", sql.VarChar, user.email)
      request.input("emailVerified", sql.DateTime2, user.emailVerified)
      request.input("image", sql.VarChar, user.image)

      const result = await request.execute<AdapterUser>("dbo.create_user")

      return { ...result.recordset[0] }
    },
    async getUser(id) {
      const request = conn.request()
      request.input("id", sql.VarChar, id)
      const result = await request.execute<AdapterUser>("dbo.get_user_by_id")

      return result.recordset[0] ?? null
    },
    async getUserByEmail(email) {
      const request = conn.request()
      request.input("email", sql.VarChar, email)

      const result = await request.execute<AdapterUser>("dbo.get_user_by_email")

      return result.recordset[0] ?? null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const request = conn.request()
      request.input("providerAccountId", sql.VarChar, providerAccountId)
      request.input("provider", sql.VarChar, provider)
      const result = await request.execute<AdapterUser>(
        "dbo.get_user_by_account"
      )

      return result.recordset[0] ? { ...result.recordset[0] } : null
    },
    async updateUser(user) {
      const request = conn.request()
      request.input("id", sql.VarChar, user.id)
      request.input("name", sql.VarChar, user.name)
      request.input("email", sql.VarChar, user.email)
      request.input("emailVerified", sql.DateTime2, user.emailVerified)
      request.input("image", sql.VarChar, user.image)
      const result = await request.execute<AdapterUser>("dbo.update_user")

      return result.recordset[0]
    },
    async deleteUser(userId) {
      const request = conn.request()
      request.input("userId", sql.UniqueIdentifier, userId)
      await request.execute("dbo.delete_user")
    },
    async linkAccount(account) {
      const request = conn.request()
      request.input("provider", sql.VarChar, account.provider)
      request.input("type", sql.VarChar, account.type)
      request.input("providerAccountId", sql.VarChar, account.providerAccountId)
      request.input("refresh_token", sql.VarChar, account.refresh_token)
      request.input("token_type", sql.VarChar, account.token_type)
      request.input("scope", sql.VarChar, account.scope)
      request.input("expires_at", sql.Int, account.expires_at)
      request.input("access_token", sql.VarChar, account.access_token)
      request.input("id_token", sql.VarChar, account.id_token)
      request.input("session_state", sql.VarChar, account.session_state)
      request.input("userId", sql.VarChar, account.userId)
      const result = await request.execute<AdapterAccount>(
        "dbo.link_account_to_user"
      )

      return { ...result.recordset[0] }
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const request = conn.request()
      request.input("providerAccountId", sql.VarChar, providerAccountId)
      request.input("provider", sql.VarChar, provider)
      await request.execute("dbo.unlink_account")
    },
    async createSession({ sessionToken, userId, expires }) {
      const request = conn.request()
      request.input("sessionToken", sql.VarChar, sessionToken)
      request.input("userId", sql.VarChar, userId)
      request.input("expires", sql.DateTime2, expires)
      const result = await request.execute<AdapterSession>(
        "dbo.create_session_for_user"
      )

      return { ...result.recordset[0] }
    },
    async getSessionAndUser(sessionToken) {
      const request = conn.request()
      request.input("sessionToken", sql.VarChar, sessionToken)
      const result = await request.execute<[AdapterSession, AdapterUser]>(
        "dbo.get_session_and_user"
      )

      const session = result.recordsets[0][0]
      const user = result.recordsets[1][0]

      if (session && user) {
        return {
          session,
          user,
        }
      } else {
        return null
      }
    },
    async updateSession(updatedSession) {
      const request = conn.request()
      request.input("sessionToken", sql.VarChar, updatedSession.sessionToken)
      const result = await request.execute<[AdapterSession, AdapterUser]>(
        "dbo.get_session_and_user"
      )

      const previousSession = result.recordsets[0][0]

      if (previousSession) {
        const currentSession = {
          ...previousSession,
          ...updatedSession,
        }

        const updateRequest = conn.request()
        updateRequest.input(
          "sessionToken",
          sql.VarChar,
          currentSession.sessionToken
        )
        updateRequest.input("userId", sql.VarChar, currentSession.userId)
        updateRequest.input("expires", sql.DateTime2, currentSession.expires)
        await updateRequest.execute<AdapterSession>("dbo.update_session")

        return currentSession as AdapterSession
      }
      return null
    },
    async deleteSession(sessionToken) {
      const request = conn.request()
      request.input("sessionToken", sql.VarChar, sessionToken)
      await request.execute<[AdapterSession, AdapterUser]>("dbo.delete_session")
    },
    async createVerificationToken(data) {
      const request = conn.request()
      request.input("identifier", sql.VarChar, data.identifier)
      request.input("token", sql.VarChar, data.token)
      request.input("expires", sql.DateTime2, data.expires)
      await request.execute<[AdapterSession, AdapterUser]>(
        "dbo.create_verification_token"
      )
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const request = conn.request()
      request.input("identifier", sql.VarChar, identifier)
      request.input("token", sql.VarChar, token)
      const result = await request.execute<VerificationToken>(
        "dbo.use_verification_token"
      )

      return result.recordset[0] ?? null
    },
    async getAccount(providerAccountId, provider) {
      const request = conn.request()
      request.input("providerAccountId", sql.VarChar, providerAccountId)
      request.input("provider", sql.VarChar, provider)
      const result = await request.execute<AdapterAccount>(
        "dbo.get_accounts_by_provider"
      )

      return result.recordset[0] ? mapExpiresAt(result.recordset[0]) : null
    },

    async createAuthenticator(authenticator) {
      const request = conn.request()
      request.input("credentialID", sql.VarChar, authenticator.credentialID)
      request.input("userId", sql.VarChar, authenticator.userId)
      request.input(
        "providerAccountId",
        sql.VarChar,
        authenticator.providerAccountId
      )
      request.input(
        "credentialPublicKey",
        sql.VarChar,
        authenticator.credentialPublicKey
      )
      request.input("counter", sql.Int, authenticator.counter)
      request.input(
        "credentialDeviceType",
        sql.VarChar,
        authenticator.credentialDeviceType
      )
      request.input(
        "credentialBackedUp",
        sql.Bit,
        authenticator.credentialBackedUp
      )
      request.input("transports", sql.VarChar, authenticator.transports)

      const result = await request.execute<AdapterAuthenticator>(
        "dbo.create_authenticator"
      )

      return { ...result.recordset[0] }
    },

    async getAuthenticator(credentialId) {
      const request = conn.request()
      request.input("credentialId", sql.VarChar, credentialId)
      const result = await request.execute<AdapterAuthenticator>(
        "dbo.get_authenticator"
      )

      return result.recordset[0] ?? null
    },

    async listAuthenticatorsByUserId(userId) {
      const request = conn.request()
      request.input("userId", sql.UniqueIdentifier, userId)
      try {
        const result = await request.execute<AdapterAuthenticator>(
          "dbo.list_authenticators_by_user_id"
        )
        return result.recordset ?? []
      } catch (_) {
        // if incoming userId is not a valid GUID, return empty array
        return []
      }
    },

    async updateAuthenticatorCounter(credentialID: string, newCounter: number) {
      const request = conn.request()
      request.input("credentialID", sql.VarChar, credentialID)
      request.input("counter", sql.Int, newCounter)
      const result = await request.execute<AdapterAuthenticator>(
        "dbo.update_authenticator_counter"
      )

      if (!result.recordset[0]) throw new Error("Authenticator not found.")

      return result.recordset[0] ?? null
    },
  }
}
