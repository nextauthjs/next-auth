import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Keycloak from "next-auth/providers/keycloak"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, `auth` and received as a prop on the `SessionProvider` React Context
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
  debug: true,
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
    Keycloak,
  ].filter(Boolean) as NextAuthConfig["providers"],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  basePath: "/auth",
  secret: "secret",
} satisfies NextAuthConfig
