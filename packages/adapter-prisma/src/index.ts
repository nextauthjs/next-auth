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
import type { PrismaClient, Prisma } from "@prisma/client"
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"

export function PrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient["$extends"]>
): Adapter {
  const p = prisma as PrismaClient
  return {
    // We need to let Prisma generate the ID because our default UUID is incompatible with MongoDB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createUser: ({ id, ...data }) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      return p.user.create({ data: filteredData });
    },
    getUser: (id) => p.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return (account?.user as AdapterUser) ?? null
    },
    updateUser: ({ id, ...data }) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      return p.user.update({
        where: { id }, data: filteredData
      }) as Promise<AdapterUser>
    },
    deleteUser: (id) =>
      p.user.delete({ where: { id } }) as Promise<AdapterUser>,
    linkAccount: (data) =>
      p.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session } as { user: AdapterUser; session: AdapterSession }
    },
    createSession: (data) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      return p.session.create({ data: filteredData })
    },
    updateSession: (data) => {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      return p.session.update({
        where: { sessionToken: data.sessionToken }, data: filteredData
      })
    },
    deleteSession: (sessionToken) =>
      p.session.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      const verificationToken = await p.verificationToken.create({
        data: filteredData
      })
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id
      return verificationToken
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        })
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id
        return verificationToken
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025")
          return null
        throw error
      }
    },
    async getAccount(providerAccountId, provider) {
      return p.account.findFirst({
        where: { providerAccountId, provider },
      }) as Promise<AdapterAccount | null>
    },
    async createAuthenticator(authenticator) {
      const filteredData = Object.fromEntries(
        Object.entries(authenticator).filter(([_, v]) => v !== undefined)
      );
      return p.authenticator.create({
        data: filteredData,
      })
    },
    async getAuthenticator(credentialID) {
      return p.authenticator.findUnique({
        where: { credentialID },
      })
    },
    async listAuthenticatorsByUserId(userId) {
      return p.authenticator.findMany({
        where: { userId },
      })
    },
    async updateAuthenticatorCounter(credentialID, counter) {
      return p.authenticator.update({
        where: { credentialID },
        data: { counter },
      })
    },
  }
}
