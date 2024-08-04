import Apple from "@auth/express/providers/apple"
import Auth0 from "@auth/express/providers/auth0"
import AzureB2C from "@auth/express/providers/azure-ad-b2c"
import BoxyHQSAML from "@auth/express/providers/boxyhq-saml"
import Cognito from "@auth/express/providers/cognito"
import Coinbase from "@auth/express/providers/coinbase"
import Discord from "@auth/express/providers/discord"
import Dropbox from "@auth/express/providers/dropbox"
import Facebook from "@auth/express/providers/facebook"
import GitHub from "@auth/express/providers/github"
import Gitlab from "@auth/express/providers/gitlab"
import Google from "@auth/express/providers/google"
import Hubspot from "@auth/express/providers/hubspot"
import Keycloak from "@auth/express/providers/keycloak"
import LinkedIn from "@auth/express/providers/linkedin"
import Mixin from "@auth/express/providers/mixin"
import Netlify from "@auth/express/providers/netlify"
import Okta from "@auth/express/providers/okta"
import Passage from "@auth/express/providers/passage"
import Pinterest from "@auth/express/providers/pinterest"
import Reddit from "@auth/express/providers/reddit"
import Slack from "@auth/express/providers/slack"
import Spotify from "@auth/express/providers/spotify"
import Twitch from "@auth/express/providers/twitch"
import Twitter from "@auth/express/providers/twitter"
import WorkOS from "@auth/express/providers/workos"
import Zoom from "@auth/express/providers/zoom"

export const authConfig = {
  trustHost: true,
  debug: process.env.NODE_ENV !== "production" ? true : false,
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
    Mixin,
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
