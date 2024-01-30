import { defineConfig } from '@auth/astro/config'
import type { Provider } from '@auth/core/providers'
import GitHub from '@auth/core/providers/github'

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }) as Provider,
  ]
})
