import NextAuth from "next-auth"

import Apple from "next-auth/providers/apple"
import Atlassian from "next-auth/providers/atlassian"
import Auth0 from "next-auth/providers/auth0"
import AzureAD from "next-auth/providers/azure-ad"
import AzureB2C from "next-auth/providers/azure-ad-b2c"
import BoxyHQSAML from "next-auth/providers/boxyhq-saml"
import Cognito from "next-auth/providers/cognito"
import Coinbase from "next-auth/providers/coinbase"
import Discord from "next-auth/providers/discord"
import Dropbox from "next-auth/providers/dropbox"
import Facebook from "next-auth/providers/facebook"
import GitHub from "next-auth/providers/github"
import Gitlab from "next-auth/providers/gitlab"
import Google from "next-auth/providers/google"
import Hubspot from "next-auth/providers/hubspot"
import Keycloak from "next-auth/providers/keycloak"
import LinkedIn from "next-auth/providers/linkedin"
import Netlify from "next-auth/providers/netlify"
import Okta from "next-auth/providers/okta"
import Passage from "next-auth/providers/passage"
import Pinterest from "next-auth/providers/pinterest"
import Reddit from "next-auth/providers/reddit"
import Slack from "next-auth/providers/slack"
import Spotify from "next-auth/providers/spotify"
import Twitch from "next-auth/providers/twitch"
import Twitter from "next-auth/providers/twitter"
import WorkOS from "next-auth/providers/workos"
import Zoom from "next-auth/providers/zoom"

import type { NextAuthConfig } from "next-auth"

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Apple,
    Atlassian,
    Auth0,
    AzureAD,
    AzureB2C,
    BoxyHQSAML({
      clientId: "dummy",
      clientSecret: "dummy",
      issuer: process.env.AUTH_BOXYHQ_SAML_ISSUER,
    }),
    Cognito,
    Coinbase,
    Discord,
    Dropbox,
    Facebook,
    GitHub,
    Gitlab,
    Google,
    Hubspot,
    Keycloak,
    LinkedIn,
    Netlify,
    Okta,
    Passage,
    Pinterest,
    Reddit,
    Slack,
    Spotify,
    Twitch,
    Twitter,
    WorkOS,
    Zoom,
  ],
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
