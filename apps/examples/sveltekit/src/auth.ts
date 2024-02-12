import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google"
import Facebook from "@auth/sveltekit/providers/facebook"
import Auth0 from "@auth/sveltekit/providers/auth0"
// import Passkey from "@auth/sveltekit/providers/passkey"
import { env } from "$env/dynamic/private"

export const { handle, signIn, signOut } = SvelteKitAuth({
  debug: env.NODE_ENV !== "production" ? true : false,
  providers: [
    GitHub,
    Google,
    Facebook,
    Auth0,
    // Passkey
  ],
  // experimental: {
  //   enableWebAuthn: true,
  // },
})
