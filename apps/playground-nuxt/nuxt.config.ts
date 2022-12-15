export default defineNuxtConfig({
  // https://v3.nuxtjs.org/migration/runtime-config#runtime-config
  runtimeConfig: {
    secret: process.env.NEXTAUTH_SECRET,
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  vite: {
    define: {
      'process.env.NEXTAUTH_URL': JSON.stringify(process.env.NEXTAUTH_URL),
      'process.env.AUTH_TRUST_HOST': JSON.stringify(process.env.AUTH_TRUST_HOST),
      'process.env.VERCEL_URL': JSON.stringify(process.env.VERCEL_URL),
    }
  }
})
