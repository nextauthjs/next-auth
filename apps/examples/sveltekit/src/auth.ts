import { SvelteKitAuth } from "@auth/sveltekit"
import Apple from "@auth/sveltekit/providers/apple"
import Auth0 from "@auth/sveltekit/providers/auth0"
import AzureB2C from "@auth/sveltekit/providers/azure-ad-b2c"
import BoxyHQSAML from "@auth/sveltekit/providers/boxyhq-saml"
import Cognito from "@auth/sveltekit/providers/cognito"
import Coinbase from "@auth/sveltekit/providers/coinbase"
import Discord from "@auth/sveltekit/providers/discord"
import Dropbox from "@auth/sveltekit/providers/dropbox"
import Facebook from "@auth/sveltekit/providers/facebook"
import GitHub from "@auth/sveltekit/providers/github"
import GitLab from "@auth/sveltekit/providers/gitlab"
import Google from "@auth/sveltekit/providers/google"
import Hubspot from "@auth/sveltekit/providers/hubspot"
import Keycloak from "@auth/sveltekit/providers/keycloak"
import LinkedIn from "@auth/sveltekit/providers/linkedin"
import Netlify from "@auth/sveltekit/providers/netlify"
import Okta from "@auth/sveltekit/providers/okta"
import Passage from "@auth/sveltekit/providers/passage"
import Pinterest from "@auth/sveltekit/providers/pinterest"
import Reddit from "@auth/sveltekit/providers/reddit"
import Slack from "@auth/sveltekit/providers/slack"
import Spotify from "@auth/sveltekit/providers/spotify"
import Twitch from "@auth/sveltekit/providers/twitch"
import Twitter from "@auth/sveltekit/providers/twitter"
import WorkOS from "@auth/sveltekit/providers/workos"
import Zoom from "@auth/sveltekit/providers/zoom"
import { env } from "$env/dynamic/private"

export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Apple,
    Auth0,
    AzureB2C({
      clientId: env.AUTH_AZURE_AD_B2C_ID,
      clientSecret: env.AUTH_AZURE_AD_B2C_SECRET,
      issuer: env.AUTH_AZURE_AD_B2C_ISSUER,
    }),
    BoxyHQSAML({
      clientId: "dummy",
      clientSecret: "dummy",
      issuer: env.AUTH_BOXYHQ_SAML_ISSUER,
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
    Slack,
    Spotify,
    Twitch,
    Twitter,
    WorkOS({
      connection: env.AUTH_WORKOS_CONNECTION!,
    }),
    Zoom,
  ],
})
