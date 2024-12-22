/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://www.prisma.io/docs">Prisma</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://www.prisma.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/prisma.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @prisma/client @auth/prisma-adapter
 * npm install prisma --save-dev
 * ```
 *
 * @module @auth/prisma-adapter
 */
import { type PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"

export function PrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>,
  options?: {
    accountModel?: string
    authenticatorModel?: string
    sessionModel?: string
    userModel?: string
    verificationTokenModel?: string
  }
): Adapter {
  const p = prisma as PrismaClient
  const accountModel =
    p[(options?.accountModel ?? "account") as keyof PrismaClient]
  const authenticatorModel =
    p[(options?.authenticatorModel ?? "authenticator") as keyof PrismaClient]
  const sessionModel =
    p[(options?.sessionModel ?? "session") as keyof PrismaClient]
  const userModel = p[(options?.userModel ?? "user") as keyof PrismaClient]
  const verificationTokenModel =
    p[
      (options?.verificationTokenModel ??
        "verificationToken") as keyof PrismaClient
    ]
  return {
    // We need to let Prisma generate the ID because our default UUID is incompatible with MongoDB
    createUser: ({ id, ...data }) => userModel.create(stripUndefined(data)),
    getUser: (id) => userModel.findUnique({ where: { id } }),
    getUserByEmail: (email) => userModel.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await accountModel.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return (account?.user as AdapterUser) ?? null
    },
    updateUser: ({ id, ...data }) =>
      userModel.update({
        where: { id },
        ...stripUndefined(data),
      }) as Promise<AdapterUser>,
    deleteUser: (id) =>
      userModel.delete({ where: { id } }) as Promise<AdapterUser>,
    linkAccount: (data) =>
      accountModel.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      accountModel.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await sessionModel.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session } as {
        user: AdapterUser
        session: AdapterSession
      }
    },
    createSession: (data) => sessionModel.create(stripUndefined(data)),
    updateSession: (data) =>
      sessionModel.update({
        where: { sessionToken: data.sessionToken },
        ...stripUndefined(data),
      }),
    deleteSession: (sessionToken) =>
      sessionModel.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const verificationToken = await verificationTokenModel.create(
        stripUndefined(data)
      )
      if ("id" in verificationToken && verificationToken.id)
        delete verificationToken.id
      return verificationToken
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await verificationTokenModel.delete({
          where: { identifier_token },
        })
        if ("id" in verificationToken && verificationToken.id)
          delete verificationToken.id
        return verificationToken
      } catch (error: unknown) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2025"
        )
          return null
        throw error
      }
    },
    async getAccount(providerAccountId, provider) {
      return accountModel.findFirst({
        where: { providerAccountId, provider },
      }) as Promise<AdapterAccount | null>
    },
    async createAuthenticator(data) {
      return authenticatorModel.create(stripUndefined(data))
    },
    async getAuthenticator(credentialID) {
      return authenticatorModel.findUnique({
        where: { credentialID },
      })
    },
    async listAuthenticatorsByUserId(userId) {
      return authenticatorModel.findMany({
        where: { userId },
      })
    },
    async updateAuthenticatorCounter(credentialID, counter) {
      return authenticatorModel.update({
        where: { credentialID },
        data: { counter },
      })
    },
  }
}

/** @see https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined */
function stripUndefined<T>(obj: T) {
  const data = {} as T
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key]
  return { data }
}
