import SvelteKitAuth from "next-auth-sveltekit"
import GitHub from 'next-auth-core/providers/github';
import Google from 'next-auth-core/providers/google';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private"
import type { AuthOptions } from "next-auth-core";

export const authOptions: AuthOptions = {
  providers: [
    GitHub({ clientId: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET }),
    Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET }),
  ],
  debug: true,
}

export const { GET, POST } = SvelteKitAuth(authOptions)