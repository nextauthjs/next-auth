import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [GitHub],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      return pathname === "/middleware-example" && !!auth
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
