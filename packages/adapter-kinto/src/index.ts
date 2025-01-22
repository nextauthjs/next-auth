import { KintoClient } from "kinto"
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"

interface KintoAdapterOptions {
  client: KintoClient
  bucket?: string
}

export function toAdapterUser(record: any): AdapterUser {
  return !record
    ? null
    : {
        id: record.id,
        email: record.email,
        emailVerified: record.emailVerified
          ? new Date(record.emailVerified)
          : null,
        name: record.name,
        image: record.image,
      }
}

export function toAdapterAccount(record: any): AdapterAccount {
  return !record
    ? null
    : {
        id: record.id,
        type: record.type,
        userId: record.userId,
        provider: record.provider,
        providerAccountId: record.providerAccountId,
        refresh_token: record.refresh_token,
        access_token: record.access_token,
        expires_at: record.expires_at,
        token_type: record.token_type,
        scope: record.scope,
        id_token: record.id_token,
        session_state: record.session_state,
      }
}

export function toAdapterSession(record: any): AdapterSession {
  return !record
    ? null
    : {
        id: record.id,
        userId: record.userId,
        sessionToken: record.sessionToken,
        expires: new Date(record.expires),
      }
}

export function toVerificationToken(record: any): VerificationToken {
  return !record
    ? null
    : {
        identifier: record.identifier,
        token: record.token,
        expires: new Date(record.expires),
      }
}

export function KintoAdapter({
  client,
  bucket = "auth",
  collectionNames = {
    users: "users",
    accounts: "accounts",
    sessions: "sessions",
    verificationTokens: "verification-tokens",
  },
}: KintoAdapterOptions): Adapter {
  const collections = {
    users: client.bucket(bucket).collection(collectionNames.users),
    accounts: client.bucket(bucket).collection(collectionNames.accounts),
    sessions: client.bucket(bucket).collection(collectionNames.sessions),
    verificationTokens: client
      .bucket(bucket)
      .collection(collectionNames.verificationTokens),
  }

  async function ensureCollections() {
    const existingCollections = new Set(
      (await client.bucket(bucket).listCollections()).data.map((c) => c.id)
    )
    await Promise.all(
      Object.keys(collections).map(async (key) => {
        if (!existingCollections.has(key)) {
          await client.bucket(bucket).createCollection(key)
        }
      })
    )
  }

  return {
    async createUser(data) {
      await ensureCollections()
      const result = await collections.users.createRecord(data)
      return toAdapterUser(result.data)
    },

    async getUser(id) {
      try {
        await ensureCollections()
        const result = await collections.users.getRecord(id)
        return toAdapterUser(result.data)
      } catch {
        return null
      }
    },

    async getUserByEmail(email) {
      await ensureCollections()
      const result = await collections.users.listRecords({ filters: { email } })
      return result.data.length ? toAdapterUser(result.data[0]) : null
    },

    async getUserByAccount({ provider, providerAccountId }) {
      await ensureCollections()
      const result = await collections.accounts.listRecords({
        filters: { provider, providerAccountId },
      })
      if (result.data.length) {
        const user = await collections.users.getRecord(result.data[0].userId)
        return toAdapterUser(user.data)
      }
      return null
    },

    async updateUser(data) {
      await ensureCollections()
      const result = await collections.users.updateRecord(data, { patch: true })
      return toAdapterUser(result.data)
    },

    async deleteUser(id) {
      await ensureCollections()
      await collections.users.deleteRecord(id)
      await Promise.all(
        (
          await collections.sessions.listRecords({ filters: { userId: id } })
        ).data.map(({ id }) => collections.sessions.deleteRecord(id))
      )
      await Promise.all(
        (
          await collections.accounts.listRecords({ filters: { userId: id } })
        ).data.map(({ id }) => collections.accounts.deleteRecord(id))
      )
    },

    async linkAccount(data) {
      await ensureCollections()
      const result = await collections.accounts.createRecord(data)
      return toAdapterAccount(result.data)
    },

    async unlinkAccount({ provider, providerAccountId }) {
      await ensureCollections()
      const result = await collections.accounts.listRecords({
        filters: { provider, providerAccountId },
      })
      if (result.data.length) {
        await collections.accounts.deleteRecord(result.data[0].id)
      }
    },

    async createSession(data) {
      await ensureCollections()
      const result = await collections.sessions.createRecord(data)
      return toAdapterSession(result.data)
    },

    async getSessionAndUser(sessionToken) {
      await ensureCollections()
      const sessionResult = await collections.sessions.listRecords({
        filters: { sessionToken },
      })
      if (sessionResult.data.length) {
        const session = sessionResult.data[0]
        const user = await collections.users.getRecord(session.userId)
        return {
          session: toAdapterSession(session),
          user: toAdapterUser(user.data),
        }
      }
      return null
    },

    async updateSession(data) {
      await ensureCollections()
      const result = await collections.sessions.listRecords({
        filters: { sessionToken: data.sessionToken },
      })
      if (result.data.length) {
        const updated = await collections.sessions.updateRecord(
          { id: result.data[0].id, ...data },
          { patch: true }
        )
        return toAdapterSession(updated.data)
      }
      return null
    },

    async deleteSession(sessionToken) {
      await ensureCollections()
      const result = await collections.sessions.listRecords({
        filters: { sessionToken },
      })
      if (result.data.length) {
        await collections.sessions.deleteRecord(result.data[0].id)
      }
    },

    async createVerificationToken(data) {
      await ensureCollections()
      const result = await collections.verificationTokens.createRecord(data)
      return toVerificationToken(result.data)
    },

    async useVerificationToken({ identifier, token }) {
      await ensureCollections()
      const result = await collections.verificationTokens.listRecords({
        filters: { identifier, token },
      })
      if (result.data.length) {
        const verificationToken = result.data[0]
        await collections.verificationTokens.deleteRecord(verificationToken.id)
        return toVerificationToken(verificationToken)
      }
      return null
    },
  }
}
