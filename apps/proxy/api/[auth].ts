import { Auth, setEnvDefaults, type AuthConfig } from "@auth/core"
import Apple from "@auth/core/providers/apple"
import Auth0 from "@auth/core/providers/auth0"
import AzureB2C from "@auth/core/providers/azure-ad-b2c"
import BankId from "@auth/core/providers/bankid-no"
import BoxyHQSAML from "@auth/core/providers/boxyhq-saml"
import Cognito from "@auth/core/providers/cognito"
import Coinbase from "@auth/core/providers/coinbase"
import Discord from "@auth/core/providers/discord"
import Dropbox from "@auth/core/providers/dropbox"
import Facebook from "@auth/core/providers/facebook"
import GitHub from "@auth/core/providers/github"
import GitLab from "@auth/core/providers/gitlab"
import Google from "@auth/core/providers/google"
import Hubspot from "@auth/core/providers/hubspot"
import Keycloak from "@auth/core/providers/keycloak"
import LinkedIn from "@auth/core/providers/linkedin"
import Netlify from "@auth/core/providers/netlify"
import Okta from "@auth/core/providers/okta"
import Passage from "@auth/core/providers/passage"
import Pinterest from "@auth/core/providers/pinterest"
import Reddit from "@auth/core/providers/reddit"
import Salesforce from "@auth/core/providers/salesforce"
import Slack from "@auth/core/providers/slack"
import Spotify from "@auth/core/providers/spotify"
import Twitch from "@auth/core/providers/twitch"
import Twitter from "@auth/core/providers/twitter"
import Vipps from "@auth/core/providers/vipps"
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
    BankId,
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
    GitLab,
    Google,
    Hubspot,
    Keycloak,
    LinkedIn,
    Netlify,
    Okta,
    Passage,
    Pinterest,
    Reddit,
    Salesforce,
    Slack,
    Spotify,
    Twitch,
    Twitter,
    Vipps,
    WorkOS,
    Zoom,
    {
      id: "tiktok",
      name: "TikTok",
      type: "oauth",
      checks: ["state"],
      clientId: process.env.AUTH_TIKTOK_ID,
      clientSecret: process.env.AUTH_TIKTOK_SECRET,
      authorization: {
        url: "https://www.tiktok.com/v2/auth/authorize",
        params: {
          client_key: process.env.AUTH_TIKTOK_ID,
          scope: "user.info.basic",
        },
      },
      token: "https://open.tiktokapis.com/v2/oauth/token/",
      userinfo:
        "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username",
      profile(profile: any) {
        return profile
      },
      style: {
        bg: "#000",
        text: "#fff",
      },
    },
  ],
  basePath: "/api",
}
setEnvDefaults(process.env, authConfig)

export default function handler(req: Request) {
  return Auth(req, authConfig)
}

export const config = { runtime: "edge" }
