import NextAuth, { NextAuthOptions } from "next-auth"
// import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import Auth0Provider from "next-auth/providers/auth0"
import KeycloakProvider from "next-auth/providers/keycloak"
import TwitterProvider, {
  TwitterLegacy as TwitterLegacyProvider,
} from "next-auth/providers/twitter"
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
import AppleProvider from "next-auth/providers/apple"
import PatreonProvider from "next-auth/providers/patreon"
import TraktProvider from "next-auth/providers/trakt"
import WorkOSProvider from "next-auth/providers/workos"
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml"

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
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: true,
  theme: {
    colorScheme: "auto",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    brandColor: "#1786fb",
  },
}

export default NextAuth(authOptions)
