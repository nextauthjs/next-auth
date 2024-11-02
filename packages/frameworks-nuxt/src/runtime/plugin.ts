import type { Session } from "@auth/core/types"
import { useAuth } from "./composables/useAuth"

export default defineNuxtPlugin({
  name: "@auth/nuxt",
  enforce: "pre",
  setup: async () => {
    const { updateSession, removeSession, session } = useAuth()

    // refresh session when running on the server or when session is not available on the client side
    if (import.meta.server || (import.meta.client && !session.value)) {
      const { basePath } = useRuntimeConfig().public.auth

      const headers = useRequestHeaders(["cookie"])
      const data = await $fetch<Session>(`${basePath}/session`, {
        headers,
      })
      const hasSession = data && Object.keys(data).length
      if (hasSession) updateSession(data)
      else removeSession()
    }
  },
})
