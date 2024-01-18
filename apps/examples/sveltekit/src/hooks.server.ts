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

export const handle = SvelteKitAuth({
  providers: [
    GitHub,
    LinkedIn,
    Google,
    Facebook,
    Twitter,
    Auth0,
    Discord,
    Twitch,
    Pinterest,
  ],
})
