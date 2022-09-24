import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import { init } from "../../../firebase/init"

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

// Adapters
import { FirestoreAdapterAdmin } from "@next-auth/firebase-adapter-admin"

// Add an adapter you want to test here.
const adapters = {
  firestoreAdmin() {
    init()
    return FirestoreAdapterAdmin()
  },
  noop() {
    return undefined
  },
}

export const authOptions: NextAuthOptions = {
  adapter: adapters.firestoreAdmin(),
  debug: true,
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    brandColor: "#1786fb",
  },
  providers: [
    Twitter({
      version: "2.0",
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
}

export default NextAuth(authOptions)
