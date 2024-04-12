import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Credentials from "@auth/sveltekit/providers/credentials"
import Facebook from "@auth/sveltekit/providers/facebook"
import Discord from "@auth/sveltekit/providers/discord"
import Google from "@auth/sveltekit/providers/google"
import { createStorage } from "unstorage"
import { UnstorageAdapter } from "@auth/unstorage-adapter"

const storage = createStorage()
export const { handle, signIn, signOut } = SvelteKitAuth({
  debug: true,
  adapter: UnstorageAdapter(storage),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "password") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://source.boringavatars.com/marble/120",
          id: "1",
        }
      },
    }),
    GitHub,
    Google,
    Facebook,
    Discord,
  ],
  theme: {
    logo: "https://authjs.dev/img/logo-sm.png",
  },
})
