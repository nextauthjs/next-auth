import { SolidAuth } from "@auth/solid-start"
import GitHub from "@auth/solid-start/providers/github"
import Discord from "@auth/solid-start/providers/discord"
import Credentials from "@auth/solid-start/providers/credentials"

export const authOptions = {
  debug: true,
  providers: [
    GitHub,
    Discord,
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
  ],
}

export const { signIn, signOut, handlers } = SolidAuth(authOptions)
