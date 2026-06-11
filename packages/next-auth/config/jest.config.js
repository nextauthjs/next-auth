const swcConfig = require("./swc.config")
// The default server pages are Preact components rendered with
// `preact-render-to-string`. Their JSX must be compiled with Preact's
// automatic runtime; the React runtime produces React elements that
// `preact-render-to-string` renders as an empty body.
const swcPreactConfig = require("./swc.preact.config")

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    {
      displayName: "core",
      testMatch: ["<rootDir>/tests/**/*.test.ts"],
      rootDir: ".",
      transform: {
        "\\.(js|jsx|ts|tsx)$": ["@swc/jest", swcPreactConfig],
      },
      coveragePathIgnorePatterns: ["tests"],
      testEnvironment: "@edge-runtime/jest-environment",
      transformIgnorePatterns: ["node_modules/(?!uuid)/"],
      /** @type {import("@edge-runtime/vm").EdgeVMOptions} */
      testEnvironmentOptions: {
        codeGeneration: {
          strings: true,
        },
      },
    },
    {
      displayName: "client",
      testMatch: ["<rootDir>/src/client/**/*.test.js"],
      setupFilesAfterEnv: ["./config/jest-setup.js"],
      rootDir: ".",
      transform: {
        "\\.(js|jsx|ts|tsx)$": ["@swc/jest", swcConfig],
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
