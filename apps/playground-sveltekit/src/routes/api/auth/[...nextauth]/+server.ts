import SvelteKitAuth from "next-auth-sveltekit"
import GitHub from 'next-auth-core/dist/providers/github';

export const { GET, POST } = SvelteKitAuth({
  providers: [
    GitHub({ clientId: process.env.GITHUB_ID!, clientSecret: process.env.GITHUB_SECRET! }),
  ]
})