import NextAuth, { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0"
import KeycloakProvider from "next-auth/providers/keycloak"
import TwitterProvider from "next-auth/providers/twitter"
import CredentialsProvider from "next-auth/providers/credentials"
import IDS4Provider from "next-auth/providers/identity-server4"
import Twitch from "next-auth/providers/twitch"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import FoursquareProvider from "next-auth/providers/foursquare"
// import FreshbooksProvider from "next-auth/providers/freshbooks"
import GitlabProvider from "next-auth/providers/gitlab"
import InstagramProvider from "next-auth/providers/instagram"
import LineProvider from "next-auth/providers/line"
import LinkedInProvider from "next-auth/providers/linkedin"
import MailchimpProvider from "next-auth/providers/mailchimp"
import DiscordProvider from "next-auth/providers/discord"
import AzureADProvider from "next-auth/providers/azure-ad"
import SpotifyProvider from "next-auth/providers/spotify"
import CognitoProvider from "next-auth/providers/cognito"
import SlackProvider from "next-auth/providers/slack"
import Okta from "next-auth/providers/okta"
import AzureB2C from "next-auth/providers/azure-ad-b2c"
import OsuProvider from "next-auth/providers/osu"

// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient()
// const adapter = PrismaAdapter(prisma)

// import { Client as FaunaClient } from "faunadb"
// import { FaunaAdapter } from "@next-auth/fauna-adapter"

// const client = new FaunaClient({
//   secret: process.env.FAUNA_SECRET,
//   domain: process.env.FAUNA_DOMAIN,
// })
// const adapter = FaunaAdapter(client)
export const authOptions: NextAuthOptions = {
  // adapter,
  providers: [
    // E-mail
    // Start fake e-mail server with `npm run start:email`
    // EmailProvider({
    //   server: {
    //     host: "127.0.0.1",
    //     auth: null,
    //     secure: false,
    //     port: 1025,
    //     tls: { rejectUnauthorized: false },
    //   },
    // }),
    // Credentials
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials.password === "pw") {
          return {
            name: "Fill Murray",
            email: "bill@fillmurray.com",
            image: "https://www.fillmurray.com/64/64",
          }
        }
        return null
      },
    }),
    // OAuth 1
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    // OAuth 2 / OIDC
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID,
      clientSecret: process.env.KEYCLOAK_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    FoursquareProvider({
      clientId: process.env.FOURSQUARE_ID,
      clientSecret: process.env.FOURSQUARE_SECRET,
    }),
    // FreshbooksProvider({
    //   clientId: process.env.FRESHBOOKS_ID,
    //   clientSecret: process.env.FRESHBOOKS_SECRET,
    // }),
    GitlabProvider({
      clientId: process.env.GITLAB_ID,
      clientSecret: process.env.GITLAB_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_ID,
      clientSecret: process.env.INSTAGRAM_SECRET,
    }),
    LineProvider({
      clientId: process.env.LINE_ID,
      clientSecret: process.env.LINE_SECRET,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
    MailchimpProvider({
      clientId: process.env.MAILCHIMP_ID,
      clientSecret: process.env.MAILCHIMP_SECRET,
    }),
    IDS4Provider({
      clientId: process.env.IDS4_ID,
      clientSecret: process.env.IDS4_SECRET,
      issuer: process.env.IDS4_ISSUER,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profilePhotoSize: 48,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_ID,
      clientSecret: process.env.COGNITO_SECRET,
      issuer: process.env.COGNITO_ISSUER,
    }),
    Okta({
      clientId: process.env.OKTA_ID,
      clientSecret: process.env.OKTA_SECRET,
      issuer: process.env.OKTA_ISSUER,
    }),
    SlackProvider({
      clientId: process.env.SLACK_ID,
      clientSecret: process.env.SLACK_SECRET,
    }),
    AzureB2C({
      clientId: process.env.AZURE_B2C_ID,
      clientSecret: process.env.AZURE_B2C_SECRET,
      tenantId: process.env.AZURE_B2C_TENANT_ID,
      primaryUserFlow: process.env.AZURE_B2C_PRIMARY_USER_FLOW,
    }),
    OsuProvider({
      clientId: process.env.OSU_CLIENT_ID,
      clientSecret: process.env.OSU_CLIENT_SECRET,
    })
  ],
  secret: process.env.SECRET,
  debug: true,
  theme: {
    colorScheme: "auto",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    brandColor: "#1786fb",
  },
}

export default NextAuth(authOptions)
