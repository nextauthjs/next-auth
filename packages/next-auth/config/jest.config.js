/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: "core",
      testMatch: ["<rootDir>/tests/**/*.test.ts"],
      rootDir: ".",
      transform: {
        "\\.(ts|tsx)$": "@swc/jest",
      },
      coveragePathIgnorePatterns: ["tests"],
      testEnvironment: "@edge-runtime/jest-environment",
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
