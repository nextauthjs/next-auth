import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Google from "@auth/sveltekit/providers/google"
import Facebook from "@auth/sveltekit/providers/facebook"
import Auth0 from "@auth/sveltekit/providers/auth0"

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers: [GitHub, Google, Facebook, Auth0],
})
