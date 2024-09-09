import config from "utils/adapter/jest-preset.js"
import path from 'node:path'

process.env.JEST_DYNAMODB_CONFIG = path.resolve('./jest-dynamodb-config.cjs');

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
export default {
  ...config,
  // // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: true,
  // // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "v8",
  // A preset that is used as a base for Jest's configuration
  preset: "@shelf/jest-dynamodb",
}
