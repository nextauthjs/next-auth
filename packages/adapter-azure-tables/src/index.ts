/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>An official <a href="https://azure.microsoft.com/en-us/products/storage/tables">Azure Table Storage</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://azure.microsoft.com/en-us/products/storage/tables">
 *   <img style={{display: "block"}} src="/img/adapters/azure-tables.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/azure-tables-adapter
 * ```
 *
 * @module @auth/azure-tables-adapter
 */

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import {
  GetTableEntityResponse,
  TableClient,
  TableEntityResult,
} from "@azure/data-tables"

export const keys = {
  user: "user",
  userByEmail: "userByEmail",
  account: "account",
  accountByUserId: "accountByUserId",
  session: "session",
  sessionByUserId: "sessionByUserId",
  verificationToken: "verificationToken",
}

export function withoutKeys<T>(
  entity: GetTableEntityResponse<TableEntityResult<T>>
): T {
  delete entity.partitionKey
  delete entity.rowKey
  // @ts-expect-error
  delete entity.etag
  delete entity.timestamp
  // @ts-expect-error
  delete entity["odata.metadata"]

  return entity
}

export const TableStorageAdapter = (client: TableClient): Adapter => {
  return {
    async createUser(user) {
      const id = crypto.randomUUID()
      const newUser = {
        ...user,
        id,
      }
      await Promise.all([
        client.createEntity({
          ...newUser,
          partitionKey: keys.userByEmail,
          rowKey: user.email,
        }),
        client.createEntity({
          ...newUser,
          partitionKey: keys.user,
          rowKey: id,
        }),
      ])
      return newUser
    },
    async getUser(id: string) {
      try {
        const user = await client.getEntity<AdapterUser>(keys.user, id)
        return withoutKeys(user)
      } catch {
        return null
      }
    },
    async getUserByEmail(email) {
      try {
        const user = await client.getEntity<AdapterUser>(
          keys.userByEmail,
          email
        )
        return withoutKeys(user)
      } catch {
        return null
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        const rowKey = `${providerAccountId}_${provider}`
        const account = await client.getEntity<AdapterAccount>(
          keys.account,
          rowKey
        )
        const user = await client.getEntity<AdapterUser>(
          keys.user,
          account.userId
        )
        return withoutKeys(user)
      } catch {
        return null
      }
    },
    async updateUser(user) {
      const _user = await client.getEntity<AdapterUser>(keys.user, user.id)
      const updatedUser = {
        ...user,
        partitionKey: keys.user,
        rowKey: _user.id,
      }
      await client.updateEntity(updatedUser, "Merge")
      return { ..._user, ...updatedUser }
    },
    async deleteUser(userId) {
      try {
        const user = await client.getEntity<AdapterUser>(keys.user, userId)
        const { sessionToken } = await client.getEntity<AdapterSession>(
          keys.sessionByUserId,
          userId
        )
        const accounts = withoutKeys(
          await client.getEntity<AdapterAccount>(keys.accountByUserId, userId)
        )
        const deleteAccounts = Object.keys(accounts).map((property) =>
          client.deleteEntity(keys.account, `${accounts[property]}_${property}`)
        )
        await Promise.allSettled([
          client.deleteEntity(keys.userByEmail, user.email),
          client.deleteEntity(keys.user, userId),
          client.deleteEntity(keys.session, sessionToken),
          client.deleteEntity(keys.sessionByUserId, userId),
          ...deleteAccounts,
          client.deleteEntity(keys.accountByUserId, userId),
        ])
        return withoutKeys(user)
      } catch {
        return null
      }
    },
    async linkAccount(account) {
      try {
        await client.createEntity({
          ...account,
          partitionKey: keys.account,
          rowKey: `${account.providerAccountId}_${account.provider}`,
        })
        await client.upsertEntity({
          partitionKey: keys.accountByUserId,
          rowKey: account.userId,
          [account.provider]: account.providerAccountId,
        })
        return account
      } catch {
        return null
      }
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const rowKey = `${providerAccountId}_${provider}`
      const account = await client.getEntity<AdapterAccount>(
        keys.account,
        rowKey
      )
      await client.deleteEntity(keys.account, rowKey)
      await client.deleteEntity(keys.accountByUserId, account.userId)
    },
    async createSession(session) {
      await client.createEntity({
        ...session,
        partitionKey: keys.session,
        rowKey: session.sessionToken,
      })
      await client.upsertEntity({
        partitionKey: keys.sessionByUserId,
        rowKey: session.userId,
        sessionToken: session.sessionToken,
      })
      return session
    },
    async getSessionAndUser(sessionToken) {
      try {
        const session = await client.getEntity<AdapterSession>(
          keys.session,
          sessionToken
        )
        if (session.expires.valueOf() < Date.now()) {
          await client.deleteEntity(keys.session, sessionToken)
        }
        const user = await client.getEntity<AdapterUser>(
          keys.user,
          session.userId
        )
        return {
          session: withoutKeys(session),
          user: withoutKeys(user),
        }
      } catch {
        return null
      }
    },
    async updateSession(session) {
      const _session = await client.getEntity<AdapterSession>(
        keys.session,
        session.sessionToken
      )
      const newSession = {
        expires: session.expires ?? _session.expires,
      }
      await client.updateEntity({
        ...newSession,
        partitionKey: keys.session,
        rowKey: session.sessionToken,
      })
      return { ...withoutKeys(_session), ...newSession }
    },
    async deleteSession(sessionToken) {
      try {
        const session = await client.getEntity<AdapterSession>(
          keys.session,
          sessionToken
        )
        await Promise.allSettled([
          client.deleteEntity(keys.session, sessionToken),
          client.deleteEntity(keys.sessionByUserId, session.userId),
        ])
        return withoutKeys(session)
      } catch {
        return null
      }
    },
    async createVerificationToken(token) {
      await client.createEntity({
        ...token,
        partitionKey: keys.verificationToken,
        rowKey: token.token,
      })
      return token
    },
    async useVerificationToken({ identifier, token }) {
      try {
        const tokenEntity = await client.getEntity<VerificationToken>(
          keys.verificationToken,
          token
        )
        if (tokenEntity.identifier !== identifier) {
          return null
        }
        await client.deleteEntity(keys.verificationToken, token)
        return withoutKeys(tokenEntity)
      } catch {
        return null
      }
    },
  }
}
