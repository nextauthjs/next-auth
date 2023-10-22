import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import Credentials from "@auth/core/providers/credentials"
import Facebook from "@auth/core/providers/facebook"
import Auth0 from "@auth/core/providers/auth0"
import Discord from "@auth/core/providers/discord"
import Email from "@auth/core/providers/email"
import Google from "@auth/core/providers/google"
import Twitter from "@auth/core/providers/twitter"
import LinkedIn from "@auth/core/providers/linkedin"
import Instagram from "@auth/core/providers/instagram"
import Okta from "@auth/core/providers/okta"
import Apple from "@auth/core/providers/apple"
import Slack from "@auth/core/providers/slack"
import Twitch from "@auth/core/providers/twitch"
import Cognito from "@auth/core/providers/cognito"
import AzureAD from "@auth/core/providers/azure-ad"
import Reddit from "@auth/core/providers/reddit"
import Spotify from "@auth/core/providers/spotify"
import {
  GITHUB_ID,
  GITHUB_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  AUTH0_ID,
  AUTH0_SECRET,
  AUTH0_ISSUER,
  DISCORD_ID,
  DISCORD_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  TWITTER_ID,
  TWITTER_SECRET,
  LINKEDIN_ID,
  LINKEDIN_SECRET,
  INSTAGRAM_ID,
  INSTAGRAM_SECRET,
  OKTA_ID,
  OKTA_SECRET,
  OKTA_ISSUER,
  APPLE_ID,
  APPLE_SECRET,
  SLACK_ID,
  SLACK_SECRET,
  TWITCH_ID,
  TWITCH_SECRET,
  COGNITO_ID,
  COGNITO_SECRET,
  COGNITO_ISSUER,
  AZURE_AD_ID,
  AZURE_AD_SECRET,
  REDDIT_ID,
  REDDIT_SECRET,
  SPOTIFY_ID,
  SPOTIFY_SECRET,
} from "$env/static/private"
import { TestAdapter } from "$lib/adapter"

const db: Record<string, any> = {}

const adapter = TestAdapter({
  getItem(key) {
    return db[key]
  },
  setItem: function (key: string, value: string): Promise<void> {
    db[key] = value
    return Promise.resolve()
  },
  deleteItems: function (...keys: string[]): Promise<void> {
    keys.forEach((key) => delete db[key])
    return Promise.resolve()
  },
})
export const handle = SvelteKitAuth({
  adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    Email({ server: "smtp://127.0.0.1:1025?tls.rejectUnauthorized=false" }),
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "pw") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://www.fillmurray.com/64/64",
          id: "1",
          foo: "",
        }
      },
    }),
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    Facebook({ clientId: FACEBOOK_ID, clientSecret: FACEBOOK_SECRET }),
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Discord({
      clientId: DISCORD_ID,
      clientSecret: DISCORD_SECRET,
    }),
    Twitter({
      clientId: TWITTER_ID,
      clientSecret: TWITTER_SECRET,
    }),
    Slack({
      clientId: SLACK_ID,
      clientSecret: SLACK_SECRET,
    }),
    LinkedIn({
      clientId: LINKEDIN_ID,
      clientSecret: LINKEDIN_SECRET,
    }),
    Okta({
      clientId: OKTA_ID,
      clientSecret: OKTA_SECRET,
      issuer: OKTA_ISSUER,
    }),
    Apple({
      clientId: APPLE_ID,
      clientSecret: APPLE_SECRET,
    }),
    Auth0({
      clientId: AUTH0_ID,
      clientSecret: AUTH0_SECRET,
      issuer: AUTH0_ISSUER,
    }),
    Spotify({
      clientId: SPOTIFY_ID,
      clientSecret: SPOTIFY_SECRET,
    }),
    Instagram({
      clientId: INSTAGRAM_ID,
      clientSecret: INSTAGRAM_SECRET,
    }),
    Cognito({
      clientId: COGNITO_ID,
      clientSecret: COGNITO_SECRET,
      issuer: COGNITO_ISSUER,
    }),
    Twitch({
      clientId: TWITCH_ID,
      clientSecret: TWITCH_SECRET,
    }),
    Reddit({
      clientId: REDDIT_ID,
      clientSecret: REDDIT_SECRET,
    }),
    AzureAD({
      clientId: AZURE_AD_ID,
      clientSecret: AZURE_AD_SECRET,
    }),
  ],
  theme: {
    logo: "https://authjs.dev/img/logo/logo-sm.webp",
  },
})
