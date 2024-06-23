import type { NuxtPage } from "nuxt/schema"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@auth/nuxt"],
  devtools: { enabled: false },
  css: ["~/assets/style.css"],

  authJs: {},

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

  hooks: {
    "pages:extend"(pages) {
      function setMiddleware(pages: NuxtPage[]) {
        for (const page of pages) {
          // Add middleware to all pages except the root and guest pages
          if (!["/", "/guest"].includes(page.path)) {
            page.meta ||= {}
            page.meta.middleware = page.meta.middleware ?? []
            page.meta?.middleware.push("auth-logged-in")
          }

          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }

      setMiddleware(pages)
    },
  },
})
