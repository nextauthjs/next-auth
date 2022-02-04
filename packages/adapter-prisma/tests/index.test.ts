import { runBasicTests } from "adapter-test"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "../src"
const prisma = new PrismaClient()

runBasicTests({
  adapter: PrismaAdapter(prisma),
  db: {
    connect: async () => {
      await Promise.all([
        prisma.user.deleteMany({}),
        prisma.account.deleteMany({}),
        prisma.session.deleteMany({}),
        prisma.verificationToken.deleteMany({}),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        prisma.user.deleteMany({}),
        prisma.account.deleteMany({}),
        prisma.session.deleteMany({}),
        prisma.verificationToken.deleteMany({}),
      ])
      await prisma.$disconnect()
    },
    verificationToken: (identifier_token) =>
      prisma.verificationToken.findUnique({
        where: { identifier_token },
      }),
    user: (id) => prisma.user.findUnique({ where: { id } }),
    account: (provider_providerAccountId) =>
      prisma.account.findUnique({
        where: { provider_providerAccountId },
      }),
    session: (sessionToken) =>
      prisma.session.findUnique({ where: { sessionToken } }),
  },
})
