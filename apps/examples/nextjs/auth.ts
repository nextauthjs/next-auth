import NextAuth from "@auth/nextjs"
import Apple from "@auth/nextjs/providers/apple"
import Atlassian from "@auth/nextjs/providers/atlassian"
import Auth0 from "@auth/nextjs/providers/auth0"
import Authentik from "@auth/nextjs/providers/authentik"
import AzureAD from "@auth/nextjs/providers/azure-ad"
import AzureB2C from "@auth/nextjs/providers/azure-ad-b2c"
import Battlenet from "@auth/nextjs/providers/battlenet"
import Box from "@auth/nextjs/providers/box"
import BoxyHQSAML from "@auth/nextjs/providers/boxyhq-saml"
import Bungie from "@auth/nextjs/providers/bungie"
import Cognito from "@auth/nextjs/providers/cognito"
import Coinbase from "@auth/nextjs/providers/coinbase"
import Discord from "@auth/nextjs/providers/discord"
import Dropbox from "@auth/nextjs/providers/dropbox"
import DuendeIDS6 from "@auth/nextjs/providers/duende-identity-server6"
import Eveonline from "@auth/nextjs/providers/eveonline"
import Facebook from "@auth/nextjs/providers/facebook"
import Faceit from "@auth/nextjs/providers/faceit"
import FortyTwoSchool from "@auth/nextjs/providers/42-school"
import Foursquare from "@auth/nextjs/providers/foursquare"
import Freshbooks from "@auth/nextjs/providers/freshbooks"
import Fusionauth from "@auth/nextjs/providers/fusionauth"
import GitHub from "@auth/nextjs/providers/github"
import Gitlab from "@auth/nextjs/providers/gitlab"
import Google from "@auth/nextjs/providers/google"
import Hubspot from "@auth/nextjs/providers/hubspot"
import Instagram from "@auth/nextjs/providers/instagram"
import Kakao from "@auth/nextjs/providers/kakao"
import Keycloak from "@auth/nextjs/providers/keycloak"
import Line from "@auth/nextjs/providers/line"
import LinkedIn from "@auth/nextjs/providers/linkedin"
import Mailchimp from "@auth/nextjs/providers/mailchimp"
import Mailru from "@auth/nextjs/providers/mailru"
import Medium from "@auth/nextjs/providers/medium"
import Naver from "@auth/nextjs/providers/naver"
import Netlify from "@auth/nextjs/providers/netlify"
import Okta from "@auth/nextjs/providers/okta"
import Onelogin from "@auth/nextjs/providers/onelogin"
import Osso from "@auth/nextjs/providers/osso"
import Osu from "@auth/nextjs/providers/osu"
import Passage from "@auth/nextjs/providers/passage"
import Patreon from "@auth/nextjs/providers/patreon"
import Pinterest from "@auth/nextjs/providers/pinterest"
import Pipedrive from "@auth/nextjs/providers/pipedrive"
import Reddit from "@auth/nextjs/providers/reddit"
import Salesforce from "@auth/nextjs/providers/salesforce"
import Slack from "@auth/nextjs/providers/slack"
import Spotify from "@auth/nextjs/providers/spotify"
import Strava from "@auth/nextjs/providers/strava"
import Todoist from "@auth/nextjs/providers/todoist"
import Trakt from "@auth/nextjs/providers/trakt"
import Twitch from "@auth/nextjs/providers/twitch"
import Twitter from "@auth/nextjs/providers/twitter"
import UnitedEffects from "@auth/nextjs/providers/united-effects"
import Vk from "@auth/nextjs/providers/vk"
import Wikimedia from "@auth/nextjs/providers/wikimedia"
import Wordpress from "@auth/nextjs/providers/wordpress"
import WorkOS from "@auth/nextjs/providers/workos"
import Yandex from "@auth/nextjs/providers/yandex"
import Zitadel from "@auth/nextjs/providers/zitadel"
import Zoho from "@auth/nextjs/providers/zoho"
import Zoom from "@auth/nextjs/providers/zoom"

import type { NextAuthConfig } from "@auth/nextjs"

export const config = {
  theme: {
    logo: "https://@auth/nextjs.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Apple,
    Atlassian,
    Auth0,
    Authentik,
    AzureAD,
    AzureB2C,
    Battlenet,
    Box,
    BoxyHQSAML,
    Bungie,
    Cognito,
    Coinbase,
    Discord,
    Dropbox,
    DuendeIDS6,
    Eveonline,
    Facebook,
    Faceit,
    FortyTwoSchool,
    Foursquare,
    Freshbooks,
    Fusionauth,
    GitHub,
    Gitlab,
    Google,
    Hubspot,
    Instagram,
    Kakao,
    Keycloak,
    Line,
    LinkedIn,
    Mailchimp,
    Mailru,
    Medium,
    Naver,
    Netlify,
    Okta,
    Onelogin,
    Osso,
    Osu,
    Passage,
    Patreon,
    Pinterest,
    Pipedrive,
    Reddit,
    Salesforce,
    Slack,
    Spotify,
    Strava,
    Todoist,
    Trakt,
    Twitch,
    Twitter,
    UnitedEffects,
    Vk,
    Wikimedia,
    Wordpress,
    WorkOS,
    Yandex,
    Zitadel,
    Zoho,
    Zoom,
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      return pathname === "/middleware-example" && !!auth
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
