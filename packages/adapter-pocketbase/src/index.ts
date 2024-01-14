import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"
import type PocketBase from "pocketbase"
import { type Record as PBRecord } from "pocketbase"

export interface PocketBaseAdapterOptions {
  username: string
  password: string
}

/** @internal */
export type PocketBaseUser = PBRecord & {
  name: string
  image: string
  email: string
  emailVerified: string
  code?: number
}

/** @internal */
export type PocketBaseSession = PBRecord & {
  expires: string
  sessionToken: string
  userId: string
  code?: number
}

/** @internal */
export type PocketBaseAccount = PBRecord & {
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token: string
  access_token: string
  expires_at: string
  token_type: string
  scope: string
  id_token: string
  session_state: string
  oauth_token_secret: string
  oauth_token: string
  code?: number
}

/** @internal */
export type PocketBaseVerificationToken = PBRecord & {
  identifier: string
  token: string
  expires: string
  code?: number
}

const PB_RECORD_KEYS = [
  "created",
  "updated",
  "clone",
  "code",
  "collectionId",
  "collectionName",
  "expand",
  "export",
  "isNew",
  "load",
]

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

/** @internal */
export const format = {
  /** Takes an object that's coming from a database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}, includeId?: boolean): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (key === "id" && !includeId) continue
      else if (PB_RECORD_KEYS.includes(key)) continue
      else if (typeof value === "string" && isDate(value?.replace(" ", "T")))
        newObject[key] = new Date(value)
      else newObject[key] = value
    return newObject as T
  },
  /** Takes an object that's coming from Auth.js and prepares it to be written to the database. */
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (value instanceof Date) newObject[key] = value.toISOString()
      else newObject[key] = value
    return newObject as T
  },
}

async function adminLogin(
  pb: PocketBase,
  options: PocketBaseAdapterOptions
): Promise<any> {
  return await pb.admins.authWithPassword(options.username, options.password)
}

/**
 * 
## Setup
 * Configure Auth.js to use the PocketBase Adapter:
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { PocketBaseAdapter } from "@auth/pocketbase-adapter"
 *
 * const pb = new Pocketbase(process.env.POCKETBASE_URL)
 *
 * export default NextAuth({
 *   adapter: PocketBaseAdapter(
 *    pb,
 *    {
 *      username: process.env.PB_USERNAME,
 *      password: process.env.PB_PASSWORD,
 *   }),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 */
export const PocketBaseAdapter = (
  client: PocketBase,
  options: PocketBaseAdapterOptions
): Adapter => {
  const { from, to } = format
  return {
    async createUser(user) {
      await client.collection("users").create<PocketBaseUser>(to(user))

      return user
    },
    async getUser(id) {
      try {
        await adminLogin(client, options)

        const pb_user = await client
          .collection("users")
          .getOne<PocketBaseUser>(id)

        if (pb_user.code) return null

        return from(pb_user, true)
      } catch {
        return null
      }
    },
    async getUserByEmail(email) {
      try {
        await adminLogin(client, options)

        const pb_user = await client
          .collection("users")
          .getFirstListItem<PocketBaseUser>(`email="${email}"`)

        if (pb_user.code) return null

        return from(pb_user, true)
      } catch {
        return null
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        await adminLogin(client, options)

        const pb_account = await client
          .collection("accounts")
          .getFirstListItem<PocketBaseAccount>(
            `provider="${provider}" && providerAccountId="${providerAccountId}"`
          )

        if (pb_account.code) return null

        const pb_user = await client
          .collection("users")
          .getOne<PocketBaseUser>(pb_account.userId)

        if (pb_user.code) return null

        return from(pb_user, true)
      } catch {
        return null
      }
    },
    async updateUser(user) {
      await adminLogin(client, options)

      const pb_user = await client
        .collection("users")
        .update<PocketBaseUser>(user.id, to(user))

      return from(pb_user, true)
    },
    async linkAccount(account) {
      const pb_account = await client
        .collection("accounts")
        .create<PocketBaseAccount>({
          ...account,
        })

      if (pb_account.code) return null

      return from<AdapterAccount>(pb_account)
    },
    async createSession(session) {
      const pb_session = await client
        .collection("sessions")
        .create<PocketBaseSession>({
          ...session,
          expires: session.expires.toISOString().replace("T", " "),
        })

      return from(pb_session)
    },
    async getSessionAndUser(sessionToken) {
      try {
        await adminLogin(client, options)

        const pb_session = await client
          .collection("sessions")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

        if (pb_session.code) return null

        const pb_user = await client
          .collection("users")
          .getOne<PocketBaseUser>(pb_session.userId)

        if (pb_user.code) return null

        return {
          session: from<AdapterSession>(pb_session),
          user: from<AdapterUser>(pb_user, true),
        }
      } catch {
        return null
      }
    },
    async updateSession(session) {
      await adminLogin(client, options)

      const record = await client
        .collection("sessions")
        .getFirstListItem<PocketBaseSession>(
          `sessionToken="${session.sessionToken}"`
        )

      const pb_session = await client
        .collection("sessions")
        .update<PocketBaseSession>(record.id, to(session))

      if (pb_session.code) return null

      return from(pb_session)
    },
    async deleteSession(sessionToken) {
      await adminLogin(client, options)

      const record = await client
        .collection("sessions")
        .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

      await client.collection("sessions").delete(record.id)
    },
    async createVerificationToken(verificationToken) {
      try {
        const pb_veriToken = await client
          .collection("verificationTokens")
          .create<PocketBaseVerificationToken>(to(verificationToken))

        if (pb_veriToken.code) return null

        return verificationToken
      } catch {
        return null
      }
    },
    async useVerificationToken({ identifier, token }) {
      try {
        await adminLogin(client, options)

        const pb_veriToken = await client
          .collection("verificationTokens")
          .getFirstListItem<PocketBaseVerificationToken>(
            `identifier="${identifier}" && token="${token}"`
          )

        if (pb_veriToken.code) return null

        const success = await client
          .collection("verificationTokens")
          .delete(pb_veriToken.id)

        if (success) {
          // @ts-expect-error internal id's are not to be returned with the rest of the token
          const { id, ...returnVal } = from(pb_veriToken)
          return returnVal
        } else {
          return null
        }
      } catch {
        return null
      }
    },
    async deleteUser(userId) {
      await adminLogin(client, options)

      await client
        .collection("users")
        .delete(userId)
        .catch(() => null)
    },
    async unlinkAccount({ provider, providerAccountId }) {
      try {
        await adminLogin(client, options)

        const pb_account = await client
          .collection("accounts")
          .getFirstListItem<PocketBaseAccount>(
            `providerAccountId="${providerAccountId} && provider=${provider}"`
          )

        await client.collection("accounts").delete(pb_account.id)
      } catch {
        return
      }
    },
  }
}
