import NextAuth from "next-auth"
import type { NextAuthConfig, User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string
    } & Omit<User, "id">
  }
}

export const authConfig = {
  debug: true,
  providers: [
    GitHub,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "1") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://www.fillmurray.com/64/64",
          id: "1",
        }
      },
    }),
  ],
  callbacks: {
    authorized(params) {
      return !!params.auth?.user
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
