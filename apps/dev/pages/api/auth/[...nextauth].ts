import NextAuth, { type NextAuthOptions } from "next-auth"

// Providers
import Apple from "next-auth/providers/apple"
import Auth0 from "next-auth/providers/auth0"
import AzureAD from "next-auth/providers/azure-ad"
import AzureB2C from "next-auth/providers/azure-ad-b2c"
import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
import Cognito from "next-auth/providers/cognito"
import Credentials from "next-auth/providers/credentials"
import Discord from "next-auth/providers/discord"
import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
import Email from "next-auth/providers/email"
import Facebook from "next-auth/providers/facebook"
import Foursquare from "next-auth/providers/foursquare"
import Freshbooks from "next-auth/providers/freshbooks"
import GitHub from "next-auth/providers/github"
import Gitlab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
import IDS4 from "next-auth/providers/identity-server4"
import Instagram from "next-auth/providers/instagram"
import Keycloak from "next-auth/providers/keycloak"
import Line from "next-auth/providers/line"
import LinkedIn from "next-auth/providers/linkedin"
import Mailchimp from "next-auth/providers/mailchimp"
import Notion from "next-auth/providers/notion"
import Okta from "next-auth/providers/okta"
import Osu from "next-auth/providers/osu"
import Patreon from "next-auth/providers/patreon"
import Slack from "next-auth/providers/slack"
import Spotify from "next-auth/providers/spotify"
import Trakt from "next-auth/providers/trakt"
import Twitch from "next-auth/providers/twitch"
import Twitter, { TwitterLegacy } from "next-auth/providers/twitter"
import Vk from "next-auth/providers/vk"
import Wikimedia from "next-auth/providers/wikimedia"
import WorkOS from "next-auth/providers/workos"

// // Prisma
// import { PrismaClient } from "@prisma/client"
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// const client = globalThis.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== "production") globalThis.prisma = client
// const adapter = PrismaAdapter(client)

// // Fauna
// import { Client as FaunaClient } from "faunadb"
// import { FaunaAdapter } from "@next-auth/fauna-adapter"
// const opts = { secret: process.env.FAUNA_SECRET, domain: process.env.FAUNA_DOMAIN }
// const client = globalThis.fauna || new FaunaClient(opts)
// if (process.env.NODE_ENV !== "production") globalThis.fauna = client
// const adapter = FaunaAdapter(client)

// // TypeORM
// import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"
// const adapter = TypeORMLegacyAdapter({
//   type: "sqlite",
//   name: "next-auth-test-memory",
//   database: "./typeorm/dev.db",
//   synchronize: true,
// })

// // Supabase
// import { SupabaseAdapter } from "@next-auth/supabase-adapter"
// const adapter = SupabaseAdapter({
//   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
//   secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
// })

export const authOptions: NextAuthOptions = {
  // adapter,
  debug: process.env.NODE_ENV !== "production",
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    brandColor: "#1786fb",
  },
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "pw") return null
        return { name: "Fill Murray", email: "bill@fillmurray.com", image: "https://www.fillmurray.com/64/64" }
      },
    }),
    Apple({ clientId: process.env.APPLE_ID, clientSecret: process.env.APPLE_SECRET }),
    Auth0({ clientId: process.env.AUTH0_ID, clientSecret: process.env.AUTH0_SECRET, issuer: process.env.AUTH0_ISSUER }),
    AzureAD({ clientId: process.env.AZURE_AD_CLIENT_ID, clientSecret: process.env.AZURE_AD_CLIENT_SECRET, tenantId: process.env.AZURE_AD_TENANT_ID }),
    AzureB2C({ clientId: process.env.AZURE_B2C_ID, clientSecret: process.env.AZURE_B2C_SECRET, issuer: process.env.AZURE_B2C_ISSUER }),
    BoxyHQSAML({ issuer: "https://jackson-demo.boxyhq.com", clientId: "tenant=boxyhq.com&product=saml-demo.boxyhq.com", clientSecret: "dummy" }),
    Cognito({ clientId: process.env.COGNITO_ID, clientSecret: process.env.COGNITO_SECRET, issuer: process.env.COGNITO_ISSUER }),
    Discord({ clientId: process.env.DISCORD_ID, clientSecret: process.env.DISCORD_SECRET }),
    DuendeIDS6({ clientId: "interactive.confidential", clientSecret: "secret", issuer: "https://demo.duendesoftware.com" }),
    Facebook({ clientId: process.env.FACEBOOK_ID, clientSecret: process.env.FACEBOOK_SECRET }),
    Foursquare({ clientId: process.env.FOURSQUARE_ID, clientSecret: process.env.FOURSQUARE_SECRET }),
    Freshbooks({ clientId: process.env.FRESHBOOKS_ID, clientSecret: process.env.FRESHBOOKS_SECRET }),
    GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET }),
    Gitlab({ clientId: process.env.GITLAB_ID, clientSecret: process.env.GITLAB_SECRET }),
    Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
    IDS4({ clientId: process.env.IDS4_ID, clientSecret: process.env.IDS4_SECRET, issuer: process.env.IDS4_ISSUER }),
    Instagram({ clientId: process.env.INSTAGRAM_ID, clientSecret: process.env.INSTAGRAM_SECRET }),
    Keycloak({ clientId: process.env.KEYCLOAK_ID, clientSecret: process.env.KEYCLOAK_SECRET, issuer: process.env.KEYCLOAK_ISSUER }),
    Line({ clientId: process.env.LINE_ID, clientSecret: process.env.LINE_SECRET }),
    LinkedIn({ clientId: process.env.LINKEDIN_ID, clientSecret: process.env.LINKEDIN_SECRET }),
    Mailchimp({ clientId: process.env.MAILCHIMP_ID, clientSecret: process.env.MAILCHIMP_SECRET }),
    Notion({ clientId: process.env.NOTION_ID, clientSecret: process.env.NOTION_SECRET }),
    Okta({ clientId: process.env.OKTA_ID, clientSecret: process.env.OKTA_SECRET, issuer: process.env.OKTA_ISSUER }),
    Osu({ clientId: process.env.OSU_CLIENT_ID, clientSecret: process.env.OSU_CLIENT_SECRET }),
    Patreon({ clientId: process.env.PATREON_ID, clientSecret: process.env.PATREON_SECRET }),
    Slack({ clientId: process.env.SLACK_ID, clientSecret: process.env.SLACK_SECRET }),
    Spotify({ clientId: process.env.SPOTIFY_ID, clientSecret: process.env.SPOTIFY_SECRET }),
    Trakt({ clientId: process.env.TRAKT_ID, clientSecret: process.env.TRAKT_SECRET }),
    Twitch({ clientId: process.env.TWITCH_ID, clientSecret: process.env.TWITCH_SECRET }),
    Twitter({ version: "2.0", clientId: process.env.TWITTER_ID, clientSecret: process.env.TWITTER_SECRET }),
    TwitterLegacy({ clientId: process.env.TWITTER_LEGACY_ID, clientSecret: process.env.TWITTER_LEGACY_SECRET }),
    Vk({ clientId: process.env.VK_ID, clientSecret: process.env.VK_SECRET }),
    Wikimedia({ clientId: process.env.WIKIMEDIA_ID, clientSecret: process.env.WIKIMEDIA_SECRET }),
    WorkOS({ clientId: process.env.WORKOS_ID, clientSecret: process.env.WORKOS_SECRET }),
  ],
}

if (authOptions.adapter) {
  authOptions.providers.unshift(
    // NOTE: You can start a fake e-mail server with `pnpm email`
    // and then go to `http://localhost:1080` in the browser
    Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" })
  )
}

export default NextAuth(authOptions)
