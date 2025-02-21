import { RedisCacheAdapter } from "../src"
import { createClient } from "@redis/client"
import { runBasicTests } from "utils/adapter"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { withAccelerate } from "@prisma/extension-accelerate"

const prisma = new PrismaClient().$extends(withAccelerate())
const prisma_adapter = PrismaAdapter(prisma)

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379')
const REDIS_USERNAME = process.env.REDIS_USERNAME || undefined
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined

const redis_client = createClient({
  url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
});
(async () => {
  await redis_client.connect()
})()

runBasicTests({
  adapter: RedisCacheAdapter(prisma_adapter, redis_client, "auth-js-cache", 3600),
  testWebAuthnMethods: true,
  db: {
    id: () => {
      return Math.random().toString(36).substring(7)
    },
    connect: async () => {
      await clean_database()
    },
    disconnect: async () => {
      await clean_database()
      await prisma.$disconnect()
    },
    user: (id) => {
      return prisma.user.findUnique({ where: { id } })
    },
    account: (provider_providerAccountId) => {
      return prisma.account.findUnique({ where: { provider_providerAccountId } })
    },
    session: (sessionToken) => {
      return prisma.session.findUnique({ where: { sessionToken } })
    },
    async verificationToken(identifier_token) {
      const result = await prisma.verificationToken.findUnique({
        where: { identifier_token },
      })
      if (!result) return null

      // @ts-ignore // MongoDB needs an ID, but we don't
      delete result.id
      return result
    },
    authenticator: (credentialID) => {
      return prisma.authenticator.findUnique({ where: { credentialID } })
    },
  },
}).then(() => {
  console.log("[Redis cache] All tests passed successfully")
});

const clean_database = async () => {
  await Promise.all([
    prisma.user.deleteMany({}),
    prisma.account.deleteMany({}),
    prisma.session.deleteMany({}),
    prisma.authenticator.deleteMany({}),
    prisma.verificationToken.deleteMany({}),
  ])
}