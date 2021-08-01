import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0"
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials"
import IDS4Provider from "next-auth/providers/identity-server4"
import Twitch from "next-auth/providers/twitch"

export default NextAuth({
  providers: [
    // E-mail
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),

    // OAuth 2
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),

    // OIDC
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
      checks: ["pkce", "state"],
    }),
    IDS4Provider({
      clientId: process.env.IDS4_ID,
      clientSecret: process.env.IDS4_SECRET,
      issuer: process.env.IDS4_ISSUER,
      checks: ["pkce"],
    }),
    Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),

    // OAuth 1
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    // Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials.password === "password") {
          return {
            id: 1,
            name: "Fill Murray",
            email: "bill@fillmurray.com",
            image: "https://www.fillmurray.com/64/64",
          }
        }
        return null
      },
    }),
  ],
  jwt: {
    encryption: true,
    secret: process.env.SECRET,
  },
  debug: true,
  theme: "auto",
})
