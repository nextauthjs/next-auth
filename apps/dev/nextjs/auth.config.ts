import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

type Providers = NextAuthConfig["providers"]

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

const providers: Providers = [
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
]

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  const GitHub = await import("next-auth/providers/github");
  providers.push(
    GitHub.default({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
  );
}

if (process.env.GOOGLE_ID && process.env.GOOGLE_SECRET) {
  const Google = await import("next-auth/providers/google");
  providers.push(
    Google.default({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
  );
}

if (process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
  const Facebook = await import("next-auth/providers/facebook");
  providers.push(
    Facebook.default({ clientId: process.env.FACEBOOK_ID, clientSecret: process.env.FACEBOOK_SECRET }),
  );
}

if (process.env.AUTH0_ID && process.env.AUTH0_SECRET) {
  const Auth0 = await import("next-auth/providers/auth0");
  providers.push(
    Auth0.default({ clientId: process.env.AUTH0_ID, clientSecret: process.env.AUTH0_SECRET }),
  );
}

if (process.env.TWITTER_ID && process.env.TWITTER_SECRET) {
  const Twitter = await import("next-auth/providers/twitter");
  providers.push(
    Twitter.default({ clientId: process.env.TWITTER_ID, clientSecret: process.env.TWITTER_SECRET }),
  );
}

const authConfig = {
  debug: false,
  trustHost: true,
  providers,
  callbacks: {
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export default authConfig 
