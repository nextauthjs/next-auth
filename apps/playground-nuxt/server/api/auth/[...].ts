import { NuxtAuthHandler } from '@/lib/auth/server'
import GithubProvider from '@auth/core/providers/github'
import type { AuthOptions } from '@auth/core'

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
}

export default NuxtAuthHandler(authOptions)
