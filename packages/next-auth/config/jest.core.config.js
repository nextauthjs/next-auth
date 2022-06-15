/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    "\\.(js|jsx|ts|tsx)$": ["@swc/jest", require("./swc.config")],
  },
  rootDir: "..",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["./config/jest-setup.js"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
