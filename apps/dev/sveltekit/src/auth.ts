import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/sveltekit/providers/github"
import Credentials from "@auth/sveltekit/providers/credentials"
import Facebook from "@auth/sveltekit/providers/facebook"
import Google from "@auth/sveltekit/providers/google"
import Discord from "@auth/sveltekit/providers/discord"
import Nodemailer from "@auth/sveltekit/providers/nodemailer"
import Keycloak from "@auth/sveltekit/providers/keycloak"
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
    GitHub,
    Google,
    Nodemailer({ server: "smtps://0.0.0.0:465?tls.rejectUnauthorized=false" }),
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "password") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://www.fillmurray.com/64/64",
          id: "1",
          foo: "",
        }
      },
    }),
    Facebook,
    Discord,
    Keycloak,
  ],
  theme: {
    logo: "https://authjs.dev/img/logo/logo-sm.webp",
  },
})
