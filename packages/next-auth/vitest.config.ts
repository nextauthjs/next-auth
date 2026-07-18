/// <reference types="vitest" />

import sharedConfig from "../utils/vitest.config"

// The shared config enables `@preact/preset-vite`, which aliases
// react/react-dom to preact/compat and breaks `@testing-library/react`.
// The preset returns an array of plugins, so drop it and keep the rest.
export default {
  ...sharedConfig,
  plugins: (sharedConfig.plugins ?? []).filter((p) => !Array.isArray(p)),
}
