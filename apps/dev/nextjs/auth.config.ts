import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
    } & User
  }

  interface User {
    foo: string
  }
}

export default {
  debug: false,
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return {
          id: "test",
          foo: "bar",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    process.env.AUTH_GITHUB_ID && (await import("next-auth/providers/github")).default,
    process.env.AUTH_GOOGLE_ID && (await import("next-auth/providers/google")).default,
    process.env.AUTH_FACEBOOK_ID && (await import("next-auth/providers/facebook")).default,
    process.env.AUTH_AUTH0_ID && (await import("next-auth/providers/auth0")).default,
    process.env.AUTH_TWITTER_ID && (await import("next-auth/providers/twitter")).default
  ].filter(Boolean) as NextAuthConfig["providers"],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig
