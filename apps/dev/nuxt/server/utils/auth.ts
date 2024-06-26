import { NuxtAuthHandler, getServerSession } from "#auth"
import type { AuthConfig } from "@auth/nuxt"
import Credentials from "@auth/nuxt/providers/credentials"
import GitHub from "@auth/nuxt/providers/github"
import Discord from "@auth/nuxt/providers/discord"
import { getServers } from "dns"
import type { H3Event } from "h3"

const runtimeConfig = useRuntimeConfig()

export const authConfig: AuthConfig = {
  ...runtimeConfig.authJs,
  secret: runtimeConfig.auth.secret,

  providers: [
    GitHub(runtimeConfig.auth.github),
    Discord(runtimeConfig.auth.discord),
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
  ],
}

export function authHandler() {
  return NuxtAuthHandler(authConfig)
}

export async function auth(event: H3Event) {
  const getSession = getServerSession(authConfig)
  return await getSession(event)
}
