import { NuxtAuthHandler } from "@/lib/auth/server"
import GithubProvider from "@auth/core/providers/github"
import type { AuthConfig } from "@auth/core"

const runtimeConfig = useRuntimeConfig()

export const authOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
} as AuthConfig

export default NuxtAuthHandler(authOptions)
