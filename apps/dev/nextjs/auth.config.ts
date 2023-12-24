import type { NextAuthConfig } from "next-auth"
import Auth0 from "next-auth/providers/auth0"
import Credentials from "next-auth/providers/credentials"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Twitter from "next-auth/providers/twitter"

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
    GitHub({ account() {} }),
    Auth0,
    Facebook,
    Google,
    Twitter,
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
  ],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig
