import { defineConfig } from "astro/config"
import auth from "@auth/astro"

import node from "@astrojs/node"

// https://astro.build/config
export default defineConfig({
  integrations: [auth()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
})
