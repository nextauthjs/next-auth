import MyModule from '../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule
  ],
  // https://v3.nuxtjs.org/migration/runtime-config#runtime-config
  runtimeConfig: {
    secret: process.env.NEXTAUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  // https://v3.nuxtjs.org/guide/concepts/esm#aliasing-libraries
  // Fix for GithubProvider is not a function error in Vite
  alias: {
    'next-auth/providers/github': 'node_modules/next-auth/providers/github.js'
  }
})
