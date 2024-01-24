import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Auth0 from "next-auth/providers/auth0"
import Twitter from "next-auth/providers/twitter"
import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

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
  adapter: PrismaAdapter(prisma),
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
    GitHub,
    Google,
    Facebook,
    Auth0,
    Twitter,
    Passkey({
      relayingParty: {
        id: "localhost",
        name: "Example",
        origin: "http://localhost:3000",
      },
    })
  ].filter(Boolean) as NextAuthConfig["providers"],
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
  basePath: "/auth",
  experimental: {
    enableWebAuthn: true
  }
} satisfies NextAuthConfig
