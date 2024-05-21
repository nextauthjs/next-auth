/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>Official <a href="https://docs.fauna.com/fauna/current/">Fauna</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://fauna.com/features">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/fauna.svg" width="64" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/fauna-adapter fauna
 * ```
 *
 * @module @auth/fauna-adapter
 */
import {
  Client,
  TimeStub,
  fql,
  NullDocument,
  QueryValue,
  QueryValueObject,
  Module,
} from "fauna"

import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
  AdapterAccount,
} from "@auth/core/adapters"

type ToFauna<T> = {
  [P in keyof T]: T[P] extends Date | null
    ? TimeStub | null
    : T[P] extends undefined
      ? null
      : T[P] extends QueryValue
        ? T[P]
        : QueryValueObject
}

export type FaunaUser = ToFauna<AdapterUser>
export type FaunaSession = ToFauna<AdapterSession>
export type FaunaVerificationToken = ToFauna<VerificationToken> & { id: string }
export type FaunaAccount = ToFauna<AdapterAccount>

type AdapterConfig = {
  collectionNames: {
    user: string
    session: string
    account: string
    verificationToken: string
  }
}

const defaultCollectionNames = {
  user: "User",
  session: "Session",
  account: "Account",
  verificationToken: "VerificationToken",
}

export function FaunaAdapter(client: Client, config?: AdapterConfig): Adapter {
  const { collectionNames = defaultCollectionNames } = config || {}

  return {
    async createUser(user) {
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).create(${format.to(user)})`
      )
      return format.from(response.data)
    },
    async getUser(id) {
      const response = await client.query<FaunaUser | NullDocument>(
        fql`Collection(${collectionNames.user}).byId(${id})`
      )
      if (response.data instanceof NullDocument) return null
      return format.from(response.data)
    },
    async getUserByEmail(email) {
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).byEmail(${email}).first()`
      )
      if (response.data === null) return null
      return format.from(response.data)
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaUser>(fql`
        let account = Collection(${collectionNames.account}).byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()
        if (account != null) {
          Collection(${collectionNames.user}).byId(account.userId)
        } else {
          null
        }
      `)
      return format.from(response.data)
    },
    async updateUser(user) {
      const _user: Partial<AdapterUser> = { ...user }
      delete _user.id
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).byId(${
          user.id
        }).update(${format.to(_user)})`
      )
      return format.from(response.data)
    },
    async deleteUser(userId) {
      await client.query(fql`
        // Delete the user's sessions
        Collection(${collectionNames.session}).byUserId(${userId}).forEach(session => session.delete())
        
        // Delete the user's accounts
        Collection(${collectionNames.account}).byUserId(${userId}).forEach(account => account.delete())
        
        // Delete the user
        Collection(${collectionNames.user}).byId(${userId}).delete()
      `)
    },
    async linkAccount(account) {
      await client.query<FaunaAccount>(
        fql`Collection(${collectionNames.account}).create(${format.to(
          account
        )})`
      )
      return account
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaAccount>(
        fql`Collection(${collectionNames.account}).byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first().delete()`
      )
      return format.from<AdapterAccount>(response.data)
    },
    async getSessionAndUser(sessionToken) {
      const response = await client.query<[FaunaUser, FaunaSession]>(fql`
        let session = Collection(${collectionNames.session}).bySessionToken(${sessionToken}).first()
        if (session != null) {
          let user = Collection(${collectionNames.user}).byId(session.userId)
          if (user != null) {
            [user, session]
          } else {
            null
          }
        } else {
          null
        }
      `)
      if (response.data === null) return null
      const [user, session] = response.data ?? []
      return { session: format.from(session), user: format.from(user) }
    },
    async createSession(session) {
      await client.query<FaunaSession>(
        fql`Collection(${collectionNames.session}).create(${format.to(
          session
        )})`
      )
      return session
    },
    async updateSession(session) {
      const response = await client.query<FaunaSession>(
        fql`Collection(${collectionNames.session}).bySessionToken(${
          session.sessionToken
        }).first().update(${format.to(session)})`
      )
      return format.from(response.data)
    },
    async deleteSession(sessionToken) {
      await client.query(
        fql`Collection(${collectionNames.session}).bySessionToken(${sessionToken}).first().delete()`
      )
    },
    async createVerificationToken(verificationToken) {
      await client.query<FaunaVerificationToken>(
        fql`Collection(${collectionNames.verificationToken}).create(${format.to(
          verificationToken
        )})`
      )
      return verificationToken
    },
    async useVerificationToken({ identifier, token }) {
      const response = await client.query<FaunaVerificationToken>(
        fql`Collection(${collectionNames.verificationToken}).byIdentifierAndToken(${identifier}, ${token}).first()`
      )
      if (response.data === null) return null
      // Delete the verification token so it can only be used once
      await client.query(
        fql`Collection(${collectionNames.verificationToken}).byId(${response.data.id}).delete()`
      )
      const _verificationToken: Partial<FaunaVerificationToken> = {
        ...response.data,
      }
      delete _verificationToken.id
      return format.from(_verificationToken)
    },
  }
}

export const format = {
  /** Takes an object that's coming from the database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}): T {
    if (!object) return null as unknown as T
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (key === "coll" || key === "ts") continue
      else if (value instanceof TimeStub) newObject[key] = value.toDate()
      else newObject[key] = value
    return newObject as T
  },
  /** Takes an object that's coming from Auth.js and prepares it to be written to the database. */
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (value instanceof Date) newObject[key] = TimeStub.fromDate(value)
      else if (typeof value === "string" && !isNaN(Date.parse(value)))
        newObject[key] = TimeStub.from(value)
      else newObject[key] = value ?? null

    return newObject as T
  },
}
