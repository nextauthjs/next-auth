/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
const { defaults: tsjPreset } = require("ts-jest/presets")

module.exports = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // A preset that is used as a base for Jest's configuration
  preset: "@shelf/jest-dynamodb",
  transform: {
    ...tsjPreset.transform,
  },
  // The test environment that will be used for testing
  testEnvironment: "node",
}
