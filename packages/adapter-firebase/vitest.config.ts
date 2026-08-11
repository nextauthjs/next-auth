/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vite"
import baseConfig from "../utils/vitest.config"

// https://vitejs.dev/config/
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      testTimeout: 30000,
      hookTimeout: 30000,
    },
  })
)
