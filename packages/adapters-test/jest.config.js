module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["dist/", "node_modules/"],
  // TODO: Set-up with Codecov https://about.codecov.io/
  // collectCoverage: true,
  // coverageReporters: ["json", "html"],
}
