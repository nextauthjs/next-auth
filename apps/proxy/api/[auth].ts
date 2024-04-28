import { Auth, setEnvDefaults, type AuthConfig } from "@auth/core"
import Apple from "@auth/core/providers/apple"
import Auth0 from "@auth/core/providers/auth0"
import AzureB2C from "@auth/core/providers/azure-ad-b2c"
import BoxyHQSAML from "@auth/core/providers/boxyhq-saml"
import Cognito from "@auth/core/providers/cognito"
import Coinbase from "@auth/core/providers/coinbase"
import Discord from "@auth/core/providers/discord"
import Dropbox from "@auth/core/providers/dropbox"
import Facebook from "@auth/core/providers/facebook"
import GitHub from "@auth/core/providers/github"
import Gitlab from "@auth/core/providers/gitlab"
import Google from "@auth/core/providers/google"
import Hubspot from "@auth/core/providers/hubspot"
import Keycloak from "@auth/core/providers/keycloak"
import LinkedIn from "@auth/core/providers/linkedin"
import Netlify from "@auth/core/providers/netlify"
import Okta from "@auth/core/providers/okta"
import Passage from "@auth/core/providers/passage"
import Pinterest from "@auth/core/providers/pinterest"
import Reddit from "@auth/core/providers/reddit"
import Slack from "@auth/core/providers/slack"
import Spotify from "@auth/core/providers/spotify"
import Twitch from "@auth/core/providers/twitch"
import Tiktok from "@auth/core/providers/tiktok"
import Twitter from "@auth/core/providers/twitter"
import WorkOS from "@auth/core/providers/workos"
import Zoom from "@auth/core/providers/zoom"

const authConfig: AuthConfig = {
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
    Tiktok,
    Twitch,
    Twitter,
    WorkOS,
    Zoom,
  ],
  basePath: "/api",
}
setEnvDefaults(process.env, authConfig)

export default function handler(req: Request) {
  return Auth(req, authConfig)
}

export const config = { runtime: "edge" }
