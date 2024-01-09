import config from "utils/adapter/jest-preset.js"
export default {
  ...config,
  transformIgnorePatterns: [`../../node_modules/.pnpm/@triplit*`]
}