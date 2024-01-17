import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import LinkedIn from "@auth/sveltekit/providers/linkedin"
import Google from "@auth/sveltekit/providers/google"
import Facebook from "@auth/sveltekit/providers/facebook"
import Twitter from "@auth/sveltekit/providers/twitter"
import Auth0 from "@auth/sveltekit/providers/auth0"
import Discord from "@auth/sveltekit/providers/discord"
import Twitch from "@auth/sveltekit/providers/twitch"
import Pinterest from "@auth/sveltekit/providers/pinterest"

import {
  AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET,
  AUTH_LINKEDIN_ID,
  AUTH_LINKEDIN_SECRET,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_FACEBOOK_ID,
  AUTH_FACEBOOK_SECRET,
  AUTH_TWITTER_ID,
  AUTH_TWITTER_SECRET,
  AUTH_AUTH0_ID,
  AUTH_AUTH0_SECRET,
  AUTH_AUTH0_ISSUER,
  AUTH_DISCORD_ID,
  AUTH_DISCORD_SECRET,
  AUTH_TWITCH_ID,
  AUTH_TWITCH_SECRET,
  AUTH_PINTEREST_ID,
  AUTH_PINTEREST_SECRET,
} from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: AUTH_GITHUB_ID, clientSecret: AUTH_GITHUB_SECRET }),
    LinkedIn({
      clientId: AUTH_LINKEDIN_ID,
      clientSecret: AUTH_LINKEDIN_SECRET,
    }),
    Google({ clientId: AUTH_GOOGLE_ID, clientSecret: AUTH_GOOGLE_SECRET }),
    Facebook({
      clientId: AUTH_FACEBOOK_ID,
      clientSecret: AUTH_FACEBOOK_SECRET,
    }),
    Twitter({ clientId: AUTH_TWITTER_ID, clientSecret: AUTH_TWITTER_SECRET }),
    Auth0({
      clientId: AUTH_AUTH0_ID,
      clientSecret: AUTH_AUTH0_SECRET,
      issuer: AUTH_AUTH0_ISSUER,
    }),
    Discord({ clientId: AUTH_DISCORD_ID, clientSecret: AUTH_DISCORD_SECRET }),
    Twitch({ clientId: AUTH_TWITCH_ID, clientSecret: AUTH_TWITCH_SECRET }),
    Pinterest({
      clientId: AUTH_PINTEREST_ID,
      clientSecret: AUTH_PINTEREST_SECRET,
    }),
  ],
})
