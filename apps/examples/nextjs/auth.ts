import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import type { NextAuthOptions as NextAuthConfig } from "next-auth"
import { getServerSession } from "next-auth"

import Apple from "next-auth/providers/apple"
import Auth0 from "next-auth/providers/auth0"
import AzureAD from "next-auth/providers/azure-ad"
import AzureB2C from "next-auth/providers/azure-ad-b2c"
import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
import Cognito from "next-auth/providers/cognito"
import Discord from "next-auth/providers/discord"
import DuendeIDS6 from "next-auth/providers/duende-identity-server6"
import Facebook from "next-auth/providers/facebook"
import Foursquare from "next-auth/providers/foursquare"
import Freshbooks from "next-auth/providers/freshbooks"
import GitHub from "next-auth/providers/github"
import Gitlab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
import Instagram from "next-auth/providers/instagram"
import Keycloak from "next-auth/providers/keycloak"
import Line from "next-auth/providers/line"
import LinkedIn from "next-auth/providers/linkedin"
import Mailchimp from "next-auth/providers/mailchimp"
import Okta from "next-auth/providers/okta"
import Osu from "next-auth/providers/osu"
import Patreon from "next-auth/providers/patreon"
import Slack from "next-auth/providers/slack"
import Spotify from "next-auth/providers/spotify"
import Trakt from "next-auth/providers/trakt"
import Twitch from "next-auth/providers/twitch"
import Twitter from "next-auth/providers/twitter"
import Yandex from "next-auth/providers/yandex"
import Vk from "next-auth/providers/vk"
import Wikimedia from "next-auth/providers/wikimedia"
import WorkOS from "next-auth/providers/workos"

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin"
  }
}

const config = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    Apple({ clientId: process.env.AUTH_APPLE_ID, clientSecret: process.env.AUTH_APPLE_SECRET }),
    Auth0({ clientId: process.env.AUTH_AUTH0_ID, clientSecret: process.env.AUTH_AUTH0_SECRET, issuer: process.env.AUTH_AUTH0_ISSUER }),
    AzureAD({ clientId: process.env.AUTH_AZUREAD_ID, clientSecret: process.env.AUTH_AZUREAD_SECRET }),
    AzureB2C({ clientId: process.env.AUTH_AZUREB2C_ID, clientSecret: process.env.AUTH_AZUREB2C_SECRET }),
    BoxyHQSAML({ clientId: process.env.AUTH_BOXYHQSAML_ID, clientSecret: process.env.AUTH_BOXYHQSAML_SECRET }),
    Cognito({ clientId: process.env.AUTH_COGNITO_ID, clientSecret: process.env.AUTH_COGNITO_SECRET }),
    Discord({ clientId: process.env.AUTH_DISCORD_ID, clientSecret: process.env.AUTH_DISCORD_SECRET }),
    DuendeIDS6({ clientId: process.env.AUTH_DUENDEIDS6_ID, clientSecret: process.env.AUTH_DUENDEIDS6_SECRET }),
    Facebook({ clientId: process.env.AUTH_FACEBOOK_ID, clientSecret: process.env.AUTH_FACEBOOK_SECRET }),
    Foursquare({ clientId: process.env.AUTH_FOURSQUARE_ID, clientSecret: process.env.AUTH_FOURSQUARE_SECRET }),
    Freshbooks({ clientId: process.env.AUTH_FRESHBOOKS_ID, clientSecret: process.env.AUTH_FRESHBOOKS_SECRET }),
    GitHub({ clientId: process.env.AUTH_GITHUB_ID, clientSecret: process.env.AUTH_GITHUB_SECRET }),
    Gitlab({ clientId: process.env.AUTH_GITLAB_ID, clientSecret: process.env.AUTH_GITLAB_SECRET }),
    Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET }),
    Instagram({ clientId: process.env.AUTH_INSTAGRAM_ID, clientSecret: process.env.AUTH_INSTAGRAM_SECRET }),
    Keycloak({ clientId: process.env.AUTH_KEYCLOAK_ID, clientSecret: process.env.AUTH_KEYCLOAK_SECRET }),
    Line({ clientId: process.env.AUTH_LINE_ID, clientSecret: process.env.AUTH_LINE_SECRET }),
    LinkedIn({ clientId: process.env.AUTH_LINKEDIN_ID, clientSecret: process.env.AUTH_LINKEDIN_SECRET }),
    Mailchimp({ clientId: process.env.AUTH_MAILCHIMP_ID, clientSecret: process.env.AUTH_MAILCHIMP_SECRET }),
    Okta({ clientId: process.env.AUTH_OKTA_ID, clientSecret: process.env.AUTH_OKTA_SECRET }),
    Osu({ clientId: process.env.AUTH_OSU_ID, clientSecret: process.env.AUTH_OSU_SECRET }),
    Patreon({ clientId: process.env.AUTH_PATREON_ID, clientSecret: process.env.AUTH_PATREON_SECRET }),
    Slack({ clientId: process.env.AUTH_SLACK_ID, clientSecret: process.env.AUTH_SLACK_SECRET }),
    Spotify({ clientId: process.env.AUTH_SPOTIFY_ID, clientSecret: process.env.AUTH_SPOTIFY_SECRET }),
    Trakt({ clientId: process.env.AUTH_TRAKT_ID, clientSecret: process.env.AUTH_TRAKT_SECRET }),
    Twitch({ clientId: process.env.AUTH_TWITCH_ID, clientSecret: process.env.AUTH_TWITCH_SECRET }),
    Twitter({ clientId: process.env.AUTH_TWITTER_ID, clientSecret: process.env.AUTH_TWITTER_SECRET, version: "2.0" }),
    Yandex({ clientId: process.env.AUTH_YANDEX_ID, clientSecret: process.env.AUTH_YANDEX_SECRET }),
    Vk({ clientId: process.env.AUTH_VK_ID, clientSecret: process.env.AUTH_VK_SECRET }),
    Wikimedia({ clientId: process.env.AUTH_WIKIMEDIA_ID, clientSecret: process.env.AUTH_WIKIMEDIA_SECRET }),
    WorkOS({ clientId: process.env.AUTH_WORKOS_ID, clientSecret: process.env.AUTH_WORKOS_SECRET }),
  ],
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
} satisfies NextAuthConfig

export default config

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
  return getServerSession(...args, config)
}

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string
      AUTH_APPLE_ID: string
      AUTH_APPLE_SECRET: string
      AUTH_AUTH0_ID: string
      AUTH_AUTH0_SECRET: string
      AUTH_AZUREAD_ID: string
      AUTH_AZUREAD_SECRET: string
      AUTH_AZUREB2C_ID: string
      AUTH_AZUREB2C_SECRET: string
      AUTH_BOXYHQSAML_ID: string
      AUTH_BOXYHQSAML_SECRET: string
      AUTH_COGNITO_ID: string
      AUTH_COGNITO_SECRET: string
      AUTH_DISCORD_ID: string
      AUTH_DISCORD_SECRET: string
      AUTH_DUENDEIDS6_ID: string
      AUTH_DUENDEIDS6_SECRET: string
      AUTH_FACEBOOK_ID: string
      AUTH_FACEBOOK_SECRET: string
      AUTH_FOURSQUARE_ID: string
      AUTH_FOURSQUARE_SECRET: string
      AUTH_FRESHBOOKS_ID: string
      AUTH_FRESHBOOKS_SECRET: string
      AUTH_GITHUB_ID: string
      AUTH_GITHUB_SECRET: string
      AUTH_GITLAB_ID: string
      AUTH_GITLAB_SECRET: string
      AUTH_GOOGLE_ID: string
      AUTH_GOOGLE_SECRET: string
      AUTH_INSTAGRAM_ID: string
      AUTH_INSTAGRAM_SECRET: string
      AUTH_KEYCLOAK_ID: string
      AUTH_KEYCLOAK_SECRET: string
      AUTH_LINE_ID: string
      AUTH_LINE_SECRET: string
      AUTH_LINKEDIN_ID: string
      AUTH_LINKEDIN_SECRET: string
      AUTH_MAILCHIMP_ID: string
      AUTH_MAILCHIMP_SECRET: string
      AUTH_OKTA_ID: string
      AUTH_OKTA_SECRET: string
      AUTH_OSU_ID: string
      AUTH_OSU_SECRET: string
      AUTH_PATREON_ID: string
      AUTH_PATREON_SECRET: string
      AUTH_SLACK_ID: string
      AUTH_SLACK_SECRET: string
      AUTH_SPOTIFY_ID: string
      AUTH_SPOTIFY_SECRET: string
      AUTH_TRAKT_ID: string
      AUTH_TRAKT_SECRET: string
      AUTH_TWITCH_ID: string
      AUTH_TWITCH_SECRET: string
      AUTH_TWITTER_ID: string
      AUTH_TWITTER_SECRET: string
      AUTH_YANDEX_ID: string
      AUTH_YANDEX_SECRET: string
      AUTH_VK_ID: string
      AUTH_VK_SECRET: string
      AUTH_WIKIMEDIA_ID: string
      AUTH_WIKIMEDIA_SECRET: string
      AUTH_WORKOS_ID: string
      AUTH_WORKOS_SECRET: string
    }
  }
}
