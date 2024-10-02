import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Credentials from "@auth/sveltekit/providers/credentials"
import Facebook from "@auth/sveltekit/providers/facebook"
import Discord from "@auth/sveltekit/providers/discord"
import Google from "@auth/sveltekit/providers/google"
import Passkey from "@auth/sveltekit/providers/passkey"
import { createStorage } from "unstorage"
import { UnstorageAdapter } from "@auth/unstorage-adapter"
import fsDriver from "unstorage/drivers/fs"
import { dev } from "$app/environment"

const storage = createStorage({
  driver: fsDriver({ base: "./tmp-unstorage" }),
})

export const { handle, signIn, signOut } = SvelteKitAuth({
  debug: dev ? true : false,
  adapter: UnstorageAdapter(storage),
  experimental: {
    enableWebAuthn: true,
  },
  providers: [
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "password") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: `https://api.dicebear.com/9.x/thumbs/svg?seed=234173&randomizeIds=true`,
          id: "1",
        }
      },
    }),
    GitHub,
    Google,
    Facebook,
    Discord,
    Passkey({
      formFields: {
        email: {
          label: "Username",
          required: true,
          autocomplete: "username webauthn",
        },
      },
    }),
  ],
  theme: {
    logo: "https://authjs.dev/img/logo-sm.png",
  },
})
