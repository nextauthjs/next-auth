import type { NextAuthConfig } from "@auth/nextjs"
import Auth0 from "@auth/nextjs/providers/auth0"
import Credentials from "@auth/nextjs/providers/credentials"
import Facebook from "@auth/nextjs/providers/facebook"
import GitHub from "@auth/nextjs/providers/github"
import Google from "@auth/nextjs/providers/google"
import Twitter from "@auth/nextjs/providers/twitter"

declare module "@auth/nextjs" {
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
