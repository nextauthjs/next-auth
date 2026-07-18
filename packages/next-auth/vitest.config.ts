/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vite"
import baseConfig from "../utils/vitest.config"

// The base config's `@preact/preset-vite` aliases react/react-dom to
// preact/compat, which breaks `@testing-library/react`, so drop the
// preset's plugins ("preact:config", "vite:preact-jsx", "preact:devtools",
// "prefresh") and keep the rest (swc).
const preactPresetPlugin = /^(preact:|vite:preact-jsx|prefresh)/

export default mergeConfig(
  { ...baseConfig, plugins: [] },
  defineConfig({
    plugins: (baseConfig.plugins ?? [])
      .flat()
      .filter(
        (p) =>
          !(
            p &&
            typeof p === "object" &&
            "name" in p &&
            preactPresetPlugin.test(p.name)
          )
      ),
  })
)
