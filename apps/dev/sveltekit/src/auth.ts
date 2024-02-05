import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Credentials from "@auth/sveltekit/providers/credentials"
import Facebook from "@auth/sveltekit/providers/facebook"
import Auth0 from "@auth/sveltekit/providers/auth0"
import Discord from "@auth/sveltekit/providers/discord"
import Email from "@auth/sveltekit/providers/email"
import Google from "@auth/sveltekit/providers/google"
import Twitter from "@auth/sveltekit/providers/twitter"
import LinkedIn from "@auth/sveltekit/providers/linkedin"
import Instagram from "@auth/sveltekit/providers/instagram"
import Okta from "@auth/sveltekit/providers/okta"
import Apple from "@auth/sveltekit/providers/apple"
import Slack from "@auth/sveltekit/providers/slack"
import Twitch from "@auth/sveltekit/providers/twitch"
import Cognito from "@auth/sveltekit/providers/cognito"
import AzureAD from "@auth/sveltekit/providers/azure-ad"
import Reddit from "@auth/sveltekit/providers/reddit"
import Spotify from "@auth/sveltekit/providers/spotify"
import SendGrid from "@auth/sveltekit/providers/sendgrid"
import { createStorage } from "unstorage"
import { UnstorageAdapter } from "@auth/unstorage-adapter"


const storage = createStorage()
export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: UnstorageAdapter(storage),
  session: {
    strategy: "jwt",
  },
  providers: [
    SendGrid,
    Email({ server: "smtps://0.0.0.0:465?tls.rejectUnauthorized=false" }),
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
    Google,
    Facebook,
    GitHub,
    Discord,
    Twitter,
    Slack,
    LinkedIn,
    Okta,
    Apple,
    Auth0,
    Spotify,
    Instagram,
    Cognito,
    Twitch,
    Reddit,
    AzureAD,
  ],
  theme: {
    logo: "https://authjs.dev/img/logo/logo-sm.webp",
  },
})
