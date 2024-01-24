import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Auth0 from "next-auth/providers/auth0"
import Twitter from "next-auth/providers/twitter"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string 
    } & User // Merging with the User interface for additional properties
  }

  interface User {
    foo: string
  }
}

export default {
  debug: false,
  providers: [
    Credentials({
      // Defining the credentials structure
      credentials: { password: { label: "Password", type: "password" } },

      // Authorization function to validate credentials
      authorize(c) {
        // Custom logic: here, it's just a simple password check
        if (c.password !== "password") return null
        // Return user object on successful authorization
        return {
          id: "test",
          foo: "bar",
          name: "Test User",
          email: "test@example.com",
        }
      },
    }),
    GitHub,
    Google,
    Facebook,
    Auth0,
    Twitter,
  ].filter(Boolean) as NextAuthConfig["providers"], // Filtering out any undefined providers

  // JWT callback configuration
  callbacks: {
    // Customizing the JWT token properties
    jwt({ token, trigger, session }) {
      // Modifying the token based on the trigger event
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },

  // Custom base path for authentication routes
  basePath: "/auth",
} satisfies NextAuthConfig // Ensuring the config satisfies NextAuthConfig type
