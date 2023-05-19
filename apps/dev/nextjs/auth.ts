import NextAuth from "@auth/nextjs"
import Email from "@auth/nextjs/providers/email"
import authConfig from "auth.config"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

const prisma = new PrismaClient()

authConfig.providers.push(
  // Start server with `pnpm email`
  // @ts-expect-error
  Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" })
)

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  // @ts-expect-error https://auth-docs-git-feat-nextjs-auth-authjs.vercel.app/guides/upgrade-to-v5#adapter-type
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
