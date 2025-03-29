import NextAuth, { NextAuthOptions } from "next-auth/legacy"
import Credentials from "next-auth/providers/credentials"
import Keycloak from "next-auth/providers/keycloak"
import GitHub from "next-auth/providers/github"

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

const options: NextAuthOptions = {
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
    GitHub,
    Keycloak,
  ],

  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  basePath: "/api/auth",
  session: { strategy: "jwt" },
}

export default NextAuth(options)
