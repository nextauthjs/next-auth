/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: "core",
      testMatch: ["**/*.test.ts"],
      rootDir: ".",
      setupFilesAfterEnv: ["./config/jest-setup.js"],
      transform: {
        "\\.(js|jsx|ts|tsx)$": ["@swc/jest", require("./swc.config")],
      },
      coveragePathIgnorePatterns: ["tests"],
    },
    {
      displayName: "client",
      testMatch: ["**/*.test.js"],
      setupFilesAfterEnv: ["./config/jest-setup.js"],
      rootDir: ".",
      transform: {
        "\\.(js|jsx|ts|tsx)$": ["@swc/jest", require("./swc.config")],
      },
      testEnvironment: "jsdom",
      coveragePathIgnorePatterns: ["__tests__"],
    },
  ],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  collectCoverage: true,
  coverageDirectory: "../coverage",
  coverageReporters: ["html", "text-summary"],
  collectCoverageFrom: ["src/**/*.(js|jsx|ts|tsx)"],
}
