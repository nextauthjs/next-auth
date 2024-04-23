import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Twitter from "next-auth/providers/twitter"
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

 export default (name: string, basePath: string) => ({
  debug: true,
  cookies: {
    sessionToken: {
      name: `${name}.authjs.session.token`,
    },
    pkceCodeVerifier: {
      name: `${name}.authjs.pkce.code_verifier`,
    },
    callbackUrl: {
      name: `${name}.authjs.callback-url`
    },
    csrfToken: {
      name: `${name}.authjs.csrf-token`,
    },
    state: {
      name: `${name}.authjs.state`,
    },
    nonce: {
      name: `${name}.authjs.nonce`,
    },
    webauthnChallenge: {
      name: `${name}.authjs.challenge`,
    },
  },
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
    Google({
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            // and more scope urls
          ].join(" "),
          prompt: "consent",
          access_type: "offline",
          // response_type: "code",
        },
      },
    }),
    // Keycloak,
    Facebook,
    Twitter,
  ].filter(Boolean) as NextAuthConfig["providers"],
  callbacks: {
    jwt({ token, trigger, session, account, ...rest }) {
      console.log("jwt call back ", trigger, name, basePath);

      if (trigger === "signIn") {
        token.access_token = account?.access_token;
        token.provider = account?.provider;
        // console.log('jwt', { token, trigger, session, account, rest})
      }
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...token,
        },
      }
    },
  },
  basePath,
  secret: process.env.AUTH_SECRET,
}) satisfies NextAuthConfig