import NextAuth from "next-auth"
import authConfig from "auth.config"
// import { PrismaClient } from "@prisma/client"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import SendGrid from "next-auth/providers/sendgrid"
// import Resend from "next-auth/providers/resend"
// import Email from "next-auth/providers/email"

// globalThis.prisma ??= new PrismaClient()

// authConfig.providers.push(
//   // Start server with `pnpm email`
//   Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" }),
//   SendGrid,
//   Resend
// )

// export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth(
//   (request) => {
//     if (request?.nextUrl.searchParams.get("test")) {
//       return {
//         // adapter: PrismaAdapter(globalThis.prisma),
//         session: { strategy: "jwt" },
//         ...authConfig,
//         providers: [],
//       }
//     }
//     return {
//       // adapter: PrismaAdapter(globalThis.prisma),
//       session: { strategy: "jwt" },
//       ...authConfig,
//     }
//   }
// )

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  // adapter: PrismaAdapter(globalThis.prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
