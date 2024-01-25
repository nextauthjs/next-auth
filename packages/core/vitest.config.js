/// <reference types="vitest" />

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  test: {
    coverage: { include: ['src/**/*.ts'] },
    setupFiles: ['./test/test-setup.ts'],
  },
})