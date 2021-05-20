module.exports = {
  transform: {
    "\\.js$": ["babel-jest", { configFile: "./config/babel.config.js" }],
  },
  roots: ["../src"],
  setupFilesAfterEnv: ["./jest-setup.js"],
  testMatch: ["**/*.test.js"],
}
