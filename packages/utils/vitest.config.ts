/// <reference types="vitest" />

import { defineConfig } from "vite"
import swc from "unplugin-swc"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      all: true,
      enabled: true,
      include: ["src"],
      reporter: ["json", "html"],
    },
    setupFiles: ["../utils/vitest-setup.ts"],
  },
  plugins: [swc.vite()],
})
