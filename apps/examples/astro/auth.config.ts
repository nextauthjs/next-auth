import { defineConfig } from "@auth/astro/config"
import GitHub from "@auth/astro/providers/github"

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
})
