import { Auth, type AuthConfig } from "@auth/core"

// Providers
import Apple from "@auth/core/providers/apple"
// import Asgardeo from "@auth/core/providers/asgardeo"
import Auth0 from "@auth/core/providers/auth0"
import AzureAD from "@auth/core/providers/azure-ad"
import AzureB2C from "@auth/core/providers/azure-ad-b2c"
// import BeyondIdentity from "@auth/core/providers/beyondidentity"
import BoxyHQSAML from "@auth/core/providers/boxyhq-saml"
// import Cognito from "@auth/core/providers/cognito"
import Credentials from "@auth/core/providers/credentials"
import Descope from "@auth/core/providers/descope"
import Discord from "@auth/core/providers/discord"
import DuendeIDS6 from "@auth/core/providers/duende-identity-server6"
// import Email from "@auth/core/providers/email"
import Facebook from "@auth/core/providers/facebook"
import Foursquare from "@auth/core/providers/foursquare"
import Freshbooks from "@auth/core/providers/freshbooks"
import GitHub from "@auth/core/providers/github"
import Gitlab from "@auth/core/providers/gitlab"
import Google from "@auth/core/providers/google"
// import IDS4 from "@auth/core/providers/identity-server4"
import Instagram from "@auth/core/providers/instagram"
// import Keycloak from "@auth/core/providers/keycloak"
import Line from "@auth/core/providers/line"
import LinkedIn from "@auth/core/providers/linkedin"
import Mailchimp from "@auth/core/providers/mailchimp"
import Notion from "@auth/core/providers/notion"
// import Okta from "@auth/core/providers/okta"
import Osu from "@auth/core/providers/osu"
import Patreon from "@auth/core/providers/patreon"
import Slack from "@auth/core/providers/slack"
import Spotify from "@auth/core/providers/spotify"
import Trakt from "@auth/core/providers/trakt"
import Twitch from "@auth/core/providers/twitch"
import Twitter from "@auth/core/providers/twitter"
import Yandex from "@auth/core/providers/yandex"
import Vk from "@auth/core/providers/vk"
import Wikimedia from "@auth/core/providers/wikimedia"
import WorkOS from "@auth/core/providers/workos"

// // Prisma
// import { PrismaClient } from "@prisma/client"
// import { PrismaAdapter } from "@auth/prisma-adapter"
// const client = globalThis.prisma || new PrismaClient()
// if (process.env.NODE_ENV !== "production") globalThis.prisma = client
// const adapter = PrismaAdapter(client)

// // Fauna
// import { Client as FaunaClient } from "faunadb"
// import { FaunaAdapter } from "@auth/fauna-adapter"
// const opts = { secret: process.env.FAUNA_SECRET, domain: process.env.FAUNA_DOMAIN }
// const client = globalThis.fauna || new FaunaClient(opts)
// if (process.env.NODE_ENV !== "production") globalThis.fauna = client
// const adapter = FaunaAdapter(client)

// // TypeORM
// import { TypeORMAdapter } from "@auth/typeorm-adapter"
// const adapter = TypeORMAdapter({
//   type: "sqlite",
//   name: "next-auth-test-memory",
//   database: "./typeorm/dev.db",
//   synchronize: true,
// })

// // Supabase
// import { SupabaseAdapter } from "@auth/supabase-adapter"
// const adapter = SupabaseAdapter({
//   url: process.env.NEXT_PUBLIC_SUPABASE_URL,
//   secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
// })

export const authConfig: AuthConfig = {
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
        return { name: "Fill Murray", email: "bill@fillmurray.com", image: "https://www.fillmurray.com/64/64", id: "1", foo: "" }
      },
    }),
    Apple({ clientId: process.env.APPLE_ID, clientSecret: process.env.APPLE_SECRET as string }),
    // Asgardeo({ clientId: process.env.ASGARDEO_CLIENT_ID, clientSecret: process.env.ASGARDEO_CLIENT_SECRET, issuer: process.env.ASGARDEO_ISSUER }),
    Auth0({ clientId: process.env.AUTH0_ID, clientSecret: process.env.AUTH0_SECRET, issuer: process.env.AUTH0_ISSUER }),
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    AzureB2C({ clientId: process.env.AZURE_B2C_ID, clientSecret: process.env.AZURE_B2C_SECRET, issuer: process.env.AZURE_B2C_ISSUER }),
    // BeyondIdentity({
    //   clientId: process.env.BEYOND_IDENTITY_CLIENT_ID,
    //   clientSecret: process.env.BEYOND_IDENTITY_CLIENT_SECRET,
    //   issuer: process.env.BEYOND_IDENTITY_ISSUER,
    // }),
    BoxyHQSAML({ issuer: "https://jackson-demo.boxyhq.com", clientId: "tenant=boxyhq.com&product=saml-demo.boxyhq.com", clientSecret: "dummy" }),
    // Cognito({ clientId: process.env.COGNITO_ID, clientSecret: process.env.COGNITO_SECRET, issuer: process.env.COGNITO_ISSUER }),
    Descope({ clientId: process.env.DESCOPE_ID, clientSecret: process.env.DESCOPE_SECRET }),
    Discord({ clientId: process.env.DISCORD_ID, clientSecret: process.env.DISCORD_SECRET }),
    DuendeIDS6({ clientId: "interactive.confidential", clientSecret: "secret", issuer: "https://demo.duendesoftware.com" }),
    Facebook({ clientId: process.env.FACEBOOK_ID, clientSecret: process.env.FACEBOOK_SECRET }),
    Foursquare({ clientId: process.env.FOURSQUARE_ID, clientSecret: process.env.FOURSQUARE_SECRET }),
    Freshbooks({ clientId: process.env.FRESHBOOKS_ID, clientSecret: process.env.FRESHBOOKS_SECRET }),
    GitHub({ clientId: process.env.GITHUB_ID, clientSecret: process.env.GITHUB_SECRET, redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL }),
    Gitlab({ clientId: process.env.GITLAB_ID, clientSecret: process.env.GITLAB_SECRET }),
    Google({ clientId: process.env.GOOGLE_ID, clientSecret: process.env.GOOGLE_SECRET }),
    // IDS4({ clientId: process.env.IDS4_ID, clientSecret: process.env.IDS4_SECRET, issuer: process.env.IDS4_ISSUER }),
    Instagram({ clientId: process.env.INSTAGRAM_ID, clientSecret: process.env.INSTAGRAM_SECRET }),
    // Keycloak({ clientId: process.env.KEYCLOAK_ID, clientSecret: process.env.KEYCLOAK_SECRET, issuer: process.env.KEYCLOAK_ISSUER }),
    Line({ clientId: process.env.LINE_ID, clientSecret: process.env.LINE_SECRET }),
    LinkedIn({ clientId: process.env.LINKEDIN_ID, clientSecret: process.env.LINKEDIN_SECRET }),
    Mailchimp({ clientId: process.env.MAILCHIMP_ID, clientSecret: process.env.MAILCHIMP_SECRET }),
    Notion({ clientId: process.env.NOTION_ID, clientSecret: process.env.NOTION_SECRET, redirectUri: process.env.NOTION_REDIRECT_URI as string }),
    // Okta({ clientId: process.env.OKTA_ID, clientSecret: process.env.OKTA_SECRET, issuer: process.env.OKTA_ISSUER }),
    Osu({ clientId: process.env.OSU_CLIENT_ID, clientSecret: process.env.OSU_CLIENT_SECRET }),
    Patreon({ clientId: process.env.PATREON_ID, clientSecret: process.env.PATREON_SECRET }),
    Slack({ clientId: process.env.SLACK_ID, clientSecret: process.env.SLACK_SECRET }),
    Spotify({ clientId: process.env.SPOTIFY_ID, clientSecret: process.env.SPOTIFY_SECRET }),
    Trakt({ clientId: process.env.TRAKT_ID, clientSecret: process.env.TRAKT_SECRET }),
    Twitch({ clientId: process.env.TWITCH_ID, clientSecret: process.env.TWITCH_SECRET }),
    Twitter({ clientId: process.env.TWITTER_ID, clientSecret: process.env.TWITTER_SECRET }),
    // TwitterLegacy({ clientId: process.env.TWITTER_LEGACY_ID, clientSecret: process.env.TWITTER_LEGACY_SECRET }),
    Yandex({ clientId: process.env.YANDEX_ID, clientSecret: process.env.YANDEX_SECRET }),
    Vk({ clientId: process.env.VK_ID, clientSecret: process.env.VK_SECRET }),
    Wikimedia({ clientId: process.env.WIKIMEDIA_ID, clientSecret: process.env.WIKIMEDIA_SECRET }),
    WorkOS({ clientId: process.env.WORKOS_ID, clientSecret: process.env.WORKOS_SECRET }),
  ],
  // debug: process.env.NODE_ENV !== "production",
}

if (authConfig.adapter) {
  // TODO:
  // authOptions.providers.unshift(
  //   // NOTE: You can start a fake e-mail server with `pnpm email`
  //   // and then go to `http://localhost:1080` in the browser
  //   Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" })
  // )
}

// TODO: move to next-auth/edge
function AuthHandler(...args: any[]) {
  const envSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  const envTrustHost = !!(process.env.NEXTAUTH_URL ?? process.env.AUTH_TRUST_HOST ?? process.env.VERCEL ?? process.env.NODE_ENV !== "production")
  if (args.length === 1) {
    return async (req: Request) => {
      args[0].secret ??= envSecret
      args[0].trustHost ??= envTrustHost
      return Auth(req, args[0])
    }
  }
  args[1].secret ??= envSecret
  args[1].trustHost ??= envTrustHost
  return Auth(args[0], args[1])
}

export default AuthHandler(authConfig)

export const config = { runtime: "edge" }
