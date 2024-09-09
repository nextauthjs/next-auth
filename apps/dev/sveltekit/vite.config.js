import { defineConfig } from "vite"
import { sveltekit } from "@sveltejs/kit/vite"

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [sveltekit()],
})
