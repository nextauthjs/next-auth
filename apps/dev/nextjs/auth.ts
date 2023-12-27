import NextAuth from "next-auth"
import Email from "next-auth/providers/email"
import authConfig from "auth.config"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"

globalThis.prisma ??= new PrismaClient()

// authConfig.providers.push(
//   // Start server with `pnpm email`
//   // @ts-expect-error
//   Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" })
// )

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  // adapter: PrismaAdapter(globalThis.prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
