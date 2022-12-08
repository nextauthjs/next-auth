import SvelteKitAuth from "next-auth-sveltekit"
import GitHub from 'next-auth-core/providers/github';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "$env/static/private"

export const authOptions = {
  providers: [
    GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }),
  ]
}

export const { GET, POST } = SvelteKitAuth(authOptions)