import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client";
export const runtime = "nodejs"
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
    // foo: string
  }
}


const prisma = new PrismaClient();

export default {
  debug: false,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
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
    Passkey({
      relayingParty: {
        id: "electric-oddly-spider.ngrok-free.app",
        name: "Example",
        origin: "https://electric-oddly-spider.ngrok-free.app",
      },
      formFields: {
        email: { label: "Email", type: "email", required: true, autocomplete: "username webauthn" },
        username: { label: "Your Name", name: "displayName", type: "text", required: false },
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
