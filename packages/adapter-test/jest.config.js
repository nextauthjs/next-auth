module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["dist/", "node_modules/"],
  rootDir: "packages/adapters-test",
  roots: ["<rootDir>/../adapters-*"]
  // TODO: Set-up with Codecov https://about.codecov.io/
  // collectCoverage: true,
  // coverageReporters: ["json", "html"],
}
