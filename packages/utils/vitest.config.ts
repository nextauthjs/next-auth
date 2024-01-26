/// <reference types="vitest" />

import { defineConfig } from "vite"
import swc from "unplugin-swc"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      include: ["src/**/*.ts"],
      reporter: ["json", "html"],
    },
    setupFiles: ["../utils/vitest-setup.ts"],
  },
  plugins: [swc.vite()],
})
