/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    "\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./config/babel.config.js" },
    ],
  },
  rootDir: "../src",
  setupFilesAfterEnv: ["../config/jest-setup.js"],
  testMatch: ["**/*.test.js"],
  // collectCoverageFrom: ["!client/__tests__/**"],
  // coverageDirectory: "../coverage",
  testEnvironment: "jsdom",
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
