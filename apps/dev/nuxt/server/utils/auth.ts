import { NuxtAuth } from "#auth"
import type { AuthConfig } from "@auth/nuxt"
import Credentials from "@auth/nuxt/providers/credentials"
import GitHub from "@auth/nuxt/providers/github"
import Discord from "@auth/nuxt/providers/discord"
import type { H3Event } from "h3"

const runtimeConfig = useRuntimeConfig()

export const authConfig: AuthConfig = {
  ...runtimeConfig.auth,
  secret: runtimeConfig.auth.secret,

  providers: [
    // GitHub({
    //   clientId: runtimeConfig.auth.github.id,
    //   clientSecret: runtimeConfig.auth.github.secret,
    // }),
    GitHub,
    Discord,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (credentials.password !== "password") return null
        return {
          name: "Fill Murray",
          email: "bill@fillmurray.com",
          image: "https://api.dicebear.com/9.x/thumbs/svg?seed=Eden",
          id: "1",
        }
      },
    }),
  ],
}

const { handlers, auth: _auth } = NuxtAuth(authConfig)

export function authHandler() {
  return handlers
}

export async function auth(event: H3Event) {
  return await _auth(event)
}
