import { defineConfig } from "@solidjs/start/config"

export default defineConfig({
  start: {
    middleware: "./src/middleware.ts",
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ["../../../"],
    },
  },
})
