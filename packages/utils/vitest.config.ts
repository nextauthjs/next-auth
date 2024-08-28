/// <reference types="vitest" />

import { defineConfig } from "vite"
import swc from "unplugin-swc"
import preact from "@preact/preset-vite"

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    // NOTE: `.spec` is reserved for Playwright tests
    include: ["**/*.test.?(c|m)[jt]s?(x)"],
    coverage: {
      all: true,
      enabled: true,
      include: ["src"],
      reporter: ["json", "html"],
    },
    setupFiles: ["../utils/vitest-setup.ts"],
  },
  plugins: [swc.vite(), preact({ include: ["**/*[jt]sx"] })],
})
