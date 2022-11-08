// @ts-expect-error: Nuxt auto-import
import { defineNuxtPlugin } from '#app'
import { SessionProviderPlugin } from './client'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(SessionProviderPlugin({}))
})
