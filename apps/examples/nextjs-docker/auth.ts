import NextAuth from "next-auth"

import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Keycloak from "next-auth/providers/keycloak"

import type { NextAuthConfig } from "next-auth"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c: any) {
        if (c.password !== "password") return null
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    GitHub,
    Keycloak,
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
    async session({ session, token, trigger }) {
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
  },
  basePath: "/auth",
  trustHost: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
