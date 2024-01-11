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
import VK from "@auth/sveltekit/providers/vk"

import {
  GITHUB_ID,
  GITHUB_SECRET,
  LINKEDIN_ID,,
  LINKEDIN_SECRET,
  GOOGLE_ID,
  GOOGLE_SECRET,
  FACEBOOK_ID,
  FACEBOOK_SECRET,
  TWITTER_ID,
  TWITTER_SECRET,
  AUTH0_ID,
  AUTH0_SECRET,
  AUTH0_ISSUER,
  DISCORD_ID,
  DISCORD_SECRET,
  TWITCH_ID,
  TWITCH_SECRET,
  PINTEREST_ID,
  PINTEREST_SECRET,
  VK_ID,
  VK_SECRET
} from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    LinkedIn({ clientId: LINKEDIN_ID, clientSecret: LINKEDIN_SECRET }),
    Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
    Facebook({ clientId: FACEBOOK_ID, clientSecret: FACEBOOK_SECRET }),
    Twitter({ clientId: TWITTER_ID, clientSecret: TWITTER_SECRET }),
    Auth0({ clientId: AUTH0_ID, clientSecret: AUTH0_SECRET, issuer: AUTH0_ISSUER }),
    Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
    Twitch({ clientId: TWITCH_ID, clientSecret: TWITCH_SECRET }),
    Pinterest({ clientId: PINTEREST_ID, clientSecret: PINTEREST_SECRET }),
    VK({ clientId: VK_ID, clientSecret: VK_SECRET })
  ],
})
