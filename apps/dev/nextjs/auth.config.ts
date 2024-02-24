import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
// import Auth0 from "next-auth/providers/auth0"
import Twitter from "next-auth/providers/twitter"
import Keycloak from "next-auth/providers/keycloak"

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
    foo?: string
  }
}

export default {
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(c) {
        if (c.password !== "password") return null
        return {
          id: "test",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    GitHub,
    Google,
    Keycloak,
    Facebook,
    // Auth0,
    Twitter,
  ].filter(Boolean) as NextAuthConfig["providers"],
  callbacks: {
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
} satisfies NextAuthConfig
