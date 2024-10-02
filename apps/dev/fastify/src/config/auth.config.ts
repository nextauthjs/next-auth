import Apple from "@auth/fastify/providers/apple"
import Auth0 from "@auth/fastify/providers/auth0"
import AzureB2C from "@auth/fastify/providers/azure-ad-b2c"
import BoxyHQSAML from "@auth/fastify/providers/boxyhq-saml"
import Cognito from "@auth/fastify/providers/cognito"
import Coinbase from "@auth/fastify/providers/coinbase"
import Discord from "@auth/fastify/providers/discord"
import Dropbox from "@auth/fastify/providers/dropbox"
import Facebook from "@auth/fastify/providers/facebook"
import GitHub from "@auth/fastify/providers/github"
import Gitlab from "@auth/fastify/providers/gitlab"
import Google from "@auth/fastify/providers/google"
import Hubspot from "@auth/fastify/providers/hubspot"
import Keycloak from "@auth/fastify/providers/keycloak"
import LinkedIn from "@auth/fastify/providers/linkedin"
import Netlify from "@auth/fastify/providers/netlify"
import Okta from "@auth/fastify/providers/okta"
import Passage from "@auth/fastify/providers/passage"
import Pinterest from "@auth/fastify/providers/pinterest"
import Reddit from "@auth/fastify/providers/reddit"
import Slack from "@auth/fastify/providers/slack"
import Spotify from "@auth/fastify/providers/spotify"
import Twitch from "@auth/fastify/providers/twitch"
import Twitter from "@auth/fastify/providers/twitter"
import WorkOS from "@auth/fastify/providers/workos"
import Zoom from "@auth/fastify/providers/zoom"

export const authConfig = {
  trustHost: true,
  debug: process.env.NODE_ENV !== "production",
  providers: [
    Apple,
    Auth0,
    AzureB2C({
      clientId: process.env.AUTH_AZURE_AD_B2C_ID,
      clientSecret: process.env.AUTH_AZURE_AD_B2C_SECRET,
      issuer: process.env.AUTH_AZURE_AD_B2C_ISSUER,
    }),
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
    WorkOS({
      connection: process.env.AUTH_WORKOS_CONNECTION!,
    }),
    Zoom,
  ],
}
