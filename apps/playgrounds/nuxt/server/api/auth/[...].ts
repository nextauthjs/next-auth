import { NuxtAuthHandler } from "@/lib/auth/server"
import GithubProvider from "@auth/core/providers/github"
import type { AuthConfig } from "@auth/core"

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthConfig = {
  secret: runtimeConfig.secret,
  providers: [
    // @ts-expect-error: TODO
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
}

export default NuxtAuthHandler(authOptions)
