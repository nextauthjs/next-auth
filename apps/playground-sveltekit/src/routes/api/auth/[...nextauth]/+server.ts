import SvelteKitAuth from "next-auth-sveltekit"
import GitHub from 'next-auth-core/providers/github';
import Google from 'next-auth-core/providers/google';
import Credentials from 'next-auth-core/providers/credentials';
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
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "pw") return null
        return { name: "Fill Murray", email: "bill@fillmurray.com", image: "https://www.fillmurray.com/64/64", id: "1", foo: "" }
      },
    }),
  ],
  debug: true,
}

export const { GET, POST } = SvelteKitAuth(authOptions)
