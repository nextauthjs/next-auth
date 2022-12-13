import SvelteKitAuth from "@auth/sveltekit"
import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import Credentials from '@auth/core/providers/credentials';
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "$env/static/private"

export const handle = SvelteKitAuth({
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
});
