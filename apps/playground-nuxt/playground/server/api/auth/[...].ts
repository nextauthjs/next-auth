import { NextAuthNuxtHandler } from 'next-auth-nuxt/handler'
import GithubProvider from 'next-auth/providers/github'
import type { NextAuthOptions } from 'next-auth'

const runtimeConfig = useRuntimeConfig()

export const authOptions: NextAuthOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    })
  ]
}

export default NextAuthNuxtHandler(authOptions)
