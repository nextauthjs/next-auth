// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@auth/nuxt"],
  devtools: { enabled: false },
  css: ["~/assets/style.css"],
  telemetry: false,

  auth: {},

  // Runtime configuration with secrets
  // Use these to override sensitive, environment dependent settings
  // In your server/routes/auth/[...]/ts file
  // https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: {
    auth: {
      secret: "",
      github: {
        clientId: "",
        clientSecret: "",
      },
      discord: {
        clientId: "",
        clientSecret: "",
      },
    },
  },

  compatibilityDate: "2024-09-29",
})
