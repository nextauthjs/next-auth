import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import auth from '@auth/astro'
import Github from '@auth/core/providers/github'
import { loadEnv } from 'vite'

const env = loadEnv(import.meta.env.MODE, process.cwd(), "")

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [auth({
    providers: [Github({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET
    })]
  })]
});
